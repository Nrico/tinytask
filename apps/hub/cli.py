import argparse
import sys
from database import init_db

def main():
    parser = argparse.ArgumentParser(description="TinyTask Agent Hub CLI")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # DB init command
    subparsers.add_parser("db-init", help="Initialize the SQLite database schema")
    
    # DB migrate command
    subparsers.add_parser("db-migrate", help="Run database migrations using Alembic")
    
    # Discovery commands
    parser_disc = subparsers.add_parser("discovery", help="Discovery Agent actions")
    parser_disc.add_argument("--ingest", action="store_true", help="Ingest raw signals")
    parser_disc.add_argument("--rank", action="store_true", help="Rank and score opportunities")
    
    # Builder commands
    parser_build = subparsers.add_parser("builder", help="Builder Agent actions")
    parser_build.add_argument("--build", type=str, metavar="SLUG", help="Build a specific tool by slug")
    parser_build.add_argument("--test", type=str, metavar="SLUG", help="Test a specific tool by slug")
    
    # Growth commands
    parser_growth = subparsers.add_parser("growth", help="Growth Agent actions")
    parser_growth.add_argument("--analyze", action="store_true", help="Analyze web metrics and generate reports")
    
    args = parser.parse_args()
    
    if args.command == "db-init":
        print("Initializing database...")
        init_db()
        print("Database initialized successfully.")
    elif args.command == "db-migrate":
        print("Running database migrations...")
        init_db()
        print("Database migrations applied successfully.")
    elif args.command == "discovery":
        if args.ingest:
            print("Running discovery signal ingestion...")
            # Todo: call discovery agent ingest
        elif args.rank:
            print("Running discovery opportunity ranking...")
            # Todo: call discovery agent rank
        else:
            parser_disc.print_help()
    elif args.command == "builder":
        if args.build:
            print(f"Triggering Builder Agent for opportunity: {args.build}")
            from database import SessionLocal
            from agents.builder import build_tool
            session = SessionLocal()
            try:
                success = build_tool(args.build, session)
                if success:
                    print("Tool built and tested successfully!")
                    sys.exit(0)
                else:
                    print("Tool build or testing failed.")
                    sys.exit(1)
            finally:
                session.close()
        elif args.test:
            import os
            print(f"Running automated tests for tool: {args.test}")
            # Runs typescript build check, linting, and Playwright E2E browser tests
            from agents.builder import run_command
            from config import settings
            
            print("Step 1: Running Next.js build compilation check...")
            ret_b, out_b = run_command(["npm", "run", "build"], settings.workspace_dir)
            if ret_b != 0:
                print(f"Next.js build compilation failed:\n{out_b}")
                sys.exit(1)
                
            print("Step 2: Running project linter check...")
            ret_l, out_l = run_command(["npm", "run", "lint"], settings.workspace_dir)
            if ret_l != 0:
                print(f"Project linting failed:\n{out_l}")
                sys.exit(1)
                
            print("Step 3: Running Playwright E2E browser tests...")
            test_path = f"tools/{args.test}/src/tests.spec.ts"
            if not os.path.exists(os.path.join(settings.workspace_dir, test_path)):
                print(f"Playwright test file not found at: {test_path}")
                sys.exit(1)
                
            ret_p, out_p = run_command(["npx", "playwright", "test", test_path], settings.workspace_dir)
            if ret_p == 0:
                print("All tests (Build, Lint, Playwright) passed successfully!")
                sys.exit(0)
            else:
                print(f"Playwright browser tests failed (exit code {ret_p}):\n{out_p}")
                sys.exit(1)
        else:
            parser_build.print_help()
    elif args.command == "growth":
        if args.analyze:
            print("Running Growth Agent metrics analysis...")
            # Todo: call growth agent analyze
        else:
            parser_growth.print_help()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
