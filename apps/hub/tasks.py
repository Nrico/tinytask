import os
from huey import SqliteHuey
from config import settings
from database import SessionLocal
from agents.builder import build_tool

# Save huey.db inside the workspace directory
huey_db_path = os.path.join(settings.workspace_dir, "huey.db")
huey = SqliteHuey(filename=huey_db_path)

@huey.task()
def run_build_tool_async(slug: str):
    print(f"[Huey Task] Starting background build for opportunity: {slug}")
    session = SessionLocal()
    try:
        success = build_tool(slug, session)
        if success:
            print(f"[Huey Task] Successfully built tool: {slug}")
        else:
            print(f"[Huey Task] Failed to build tool: {slug}")
    except Exception as e:
        print(f"[Huey Task] Error running build for {slug}: {e}")
    finally:
        session.close()
