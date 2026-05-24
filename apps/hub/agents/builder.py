import os
import shutil
import subprocess
import re
from datetime import datetime
from sqlalchemy.orm import Session
from jinja2 import Template
import database as db
from config import settings

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")

def replace_placeholders(src_path: str, dest_path: str, context: dict):
    if src_path.endswith((".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg")):
        shutil.copy2(src_path, dest_path)
        return
        
    with open(src_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    rendered = content
    for key, val in context.items():
        rendered = rendered.replace("{{" + " " + key + " " + "}}", str(val))
        rendered = rendered.replace("{{" + key + "}}", str(val))
    
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(rendered)


def run_command(args: list[str], cwd: str) -> tuple[int, str]:
    try:
        result = subprocess.run(
            args,
            shell=False,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=120
        )
        return result.returncode, result.stdout + "\n" + result.stderr
    except subprocess.TimeoutExpired as e:
        return -1, f"Command timed out: {e.stdout}\n{e.stderr}"
    except Exception as e:
        return -1, str(e)

def build_tool(slug: str, session: Session) -> bool:
    opportunity = session.query(db.Opportunity).filter(db.Opportunity.slug == slug).first()
    if not opportunity:
        print(f"Opportunity not found for slug: {slug}")
        return False
        
    print(f"Starting Builder Agent for: {opportunity.title}")
    opportunity.status = "building"
    session.commit()
    
    # Create or fetch Build log
    build_log = db.Build(
        opportunity_id=opportunity.id,
        branch_name=f"tool/{slug}",
        status="generating",
        repair_attempts=0
    )
    session.add(build_log)
    session.commit()
    
    tool_dir = os.path.join(settings.workspace_dir, "tools", slug)
    if os.path.exists(tool_dir):
        print(f"Directory {tool_dir} already exists. Cleaning it...")
        shutil.rmtree(tool_dir)
        
    # Context for Jinja2 template rendering
    context = {
        "slug": slug,
        "name": opportunity.title,
        "description": opportunity.problem,
        "category": "utilities",
        "component_name": "".join([x.capitalize() for x in slug.split("-")]) + "Page"
    }
    
    # Copy template structure recursively
    try:
        for root, dirs, files in os.walk(TEMPLATE_DIR):
            for file in files:
                src_file = os.path.join(root, file)
                rel_path = os.path.relpath(src_file, TEMPLATE_DIR)
                dest_file = os.path.join(tool_dir, rel_path)
                replace_placeholders(src_file, dest_file, context)
                
        print(f"Copied templates for {slug} to {tool_dir}.")
    except Exception as e:
        print(f"Failed to generate template structure: {e}")
        opportunity.status = "failed"
        build_log.status = "failed"
        build_log.test_results = f"Template copy failed: {e}"
        session.commit()
        return False
        
    # Run git checkout branch
    git_cwd = settings.workspace_dir
    run_command(["git", "checkout", "-B", f"tool/{slug}"], git_cwd)
    
    # Run workspace link and compilation check
    build_log.status = "testing"
    session.commit()
    
    print("Linking workspaces and running typescript build check...")
    # Run npm install to link the new workspace package
    ret, out = run_command(["npm", "install"], git_cwd)
    if ret != 0:
        build_log.status = "failed"
        build_log.test_results = f"npm install failed:\n{out}"
        opportunity.status = "failed"
        session.commit()
        return False
        
    # Self-repair validation loop
    success = False
    for attempt in range(3): # Attempt 0, 1, 2 (max 2 repairs)
        build_log.repair_attempts = attempt
        session.commit()
        
        # Test compiler & build
        build_ret, build_out = run_command(["npm", "run", "build"], git_cwd)
        lint_ret, lint_out = run_command(["npm", "run", "lint"], git_cwd)
        
        if build_ret == 0 and lint_ret == 0:
            success = True
            build_log.test_results = f"Build and lint successful.\nBuild output:\n{build_out}\nLint output:\n{lint_out}"
            break
            
        print(f"Build or lint failed on attempt {attempt}. Executing self-repair...")
        # Self-repair logic goes here
        # In a real system, we'd feed build_out to LLM and patch files.
        # For our mock repair, if it's the first attempt, we write a patch or try to clean build artifacts.
        # Let's save the failure logs
        build_log.test_results = f"Build failed (ret={build_ret}):\n{build_out}\nLint failed (ret={lint_ret}):\n{lint_out}"
        session.commit()
        
        if attempt < 2:
            # Simple self-repair patch: clean cache / node_modules or rebuild
            print("Self-repair: running clean and rebuild...")
            shutil.rmtree(os.path.join(git_cwd, "apps/web/.next"), ignore_errors=True)
            
    if not success:
        print("Tool generation failed all self-repair attempts.")
        opportunity.status = "failed"
        build_log.status = "failed"
        session.commit()
        return False
        
    # Commit changes to local branch
    run_command(["git", "add", "."], git_cwd)
    run_command(["git", "commit", "-m", f"feat(tool): add {opportunity.title} generated tool"], git_cwd)
    
    # Push branch to remote and create Pull Request
    push_ret, push_out = run_command(["git", "push", "-f", "-u", "origin", f"tool/{slug}"], git_cwd)
    if push_ret == 0:
        print(f"Successfully pushed branch tool/{slug} to origin.")
        pr_title = f"feat(tool): add {opportunity.title} generated tool"
        pr_body = f"This PR adds the generated `{opportunity.title}` tool.\n\n### Problem\n{opportunity.problem}\n\n### Scope\n{opportunity.mvp_scope}"
        pr_ret, pr_out = run_command(["gh", "pr", "create", "--title", pr_title, "--body", pr_body, "--head", f"tool/{slug}", "--base", "main"], git_cwd)
        if pr_ret == 0:
            pr_match = re.search(r'/pull/(\d+)', pr_out)
            if pr_match:
                build_log.pr_number = int(pr_match.group(1))
                print(f"Successfully created PR #{build_log.pr_number}!")
        else:
            print(f"Failed to create PR (or it already exists): {pr_out}")
            # If PR already exists, try to get its number
            pr_list_ret, pr_list_out = run_command(["gh", "pr", "list", "--head", f"tool/{slug}", "--json", "number", "--jq", ".[0].number"], git_cwd)
            if pr_list_ret == 0 and pr_list_out.strip():
                try:
                    build_log.pr_number = int(pr_list_out.strip())
                    print(f"Associated with existing PR #{build_log.pr_number}")
                except ValueError:
                    pass
    else:
        print(f"Failed to push branch to origin: {push_out}")
    
    # Try Vercel preview deployment or fall back to localhost mock URL
    preview_url = f"http://localhost:3000/tools/{slug}"
    # check if we can run vercel preview
    vercel_ret, vercel_out = run_command(["npx", "vercel", "--preview", "--yes"], git_cwd)
    if vercel_ret == 0:
        # Extract vercel URL from output
        url_match = re.search(r'(https://[a-zA-Z0-9-]+\.vercel\.app)', vercel_out)
        if url_match:
            preview_url = url_match.group(1)
            
    build_log.preview_url = preview_url
    build_log.status = "preview_created"
    opportunity.status = "previewed"
    session.commit()
    
    print(f"Builder Agent completed successfully! Preview URL: {preview_url}")
    return True
