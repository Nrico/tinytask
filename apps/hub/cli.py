import argparse
import sys
from database import init_db

def main():
    parser = argparse.ArgumentParser(description="TinyTask Agent Hub CLI")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # DB init command
    subparsers.add_parser("db-init", help="Initialize the SQLite database schema")
    
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
            # Todo: call builder agent build
        elif args.test:
            print(f"Running automated tests for tool: {args.test}")
            # Todo: call builder agent test
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
