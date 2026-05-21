from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import database as db
import pydantic
from datetime import datetime

app = FastAPI(title="TinyTask Agentic Hub API")

# Enable CORS for standard Next.js frontend running locally
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schemas for response/request serialization
class OpportunitySchema(pydantic.BaseModel):
    id: int
    slug: str
    title: str
    problem: str
    target_user: str
    why_it_matters: str
    mvp_scope: str
    risks: str
    recommended_implementation: str
    score_pain: int
    score_frequency: int
    score_fit: int
    score_simplicity: int
    score_seo: int
    score_monetization: int
    score_risk: int
    score_total: float
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BuildSchema(pydantic.BaseModel):
    id: int
    opportunity_id: int
    branch_name: str
    status: str
    pr_number: Optional[int] = None
    preview_url: Optional[str] = None
    test_results: Optional[str] = None
    repair_attempts: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

@app.get("/")
def read_root():
    return {"status": "online", "service": "tinytask-agent-hub"}

@app.get("/api/opportunities", response_model=List[OpportunitySchema])
def get_opportunities(session: Session = Depends(db.get_db)):
    return session.query(db.Opportunity).order_by(db.Opportunity.score_total.desc()).all()

def run_build_tool_background(slug: str):
    from database import SessionLocal
    from agents.builder import build_tool
    session = SessionLocal()
    try:
        build_tool(slug, session)
    except Exception as e:
        print(f"Error in background build for {slug}: {e}")
    finally:
        session.close()

@app.post("/api/opportunities/{slug}/build")
def build_opportunity(slug: str, background_tasks: BackgroundTasks, session: Session = Depends(db.get_db)):
    opportunity = session.query(db.Opportunity).filter(db.Opportunity.slug == slug).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    if opportunity.status not in ["discovered", "prioritized", "approved_for_build", "failed"]:
        raise HTTPException(status_code=400, detail=f"Cannot build opportunity in status: {opportunity.status}")
        
    opportunity.status = "approved_for_build"
    session.commit()
    
    background_tasks.add_task(run_build_tool_background, slug)
    
    return {"status": "queued", "message": f"Building {slug} in background"}

@app.get("/api/builds", response_model=List[BuildSchema])
def get_builds(session: Session = Depends(db.get_db)):
    return session.query(db.Build).order_by(db.Build.created_at.desc()).all()

@app.post("/api/builds/{build_id}/approve")
def approve_build(build_id: int, background_tasks: BackgroundTasks, session: Session = Depends(db.get_db)):
    build = session.query(db.Build).filter(db.Build.id == build_id).first()
    if not build:
        raise HTTPException(status_code=404, detail="Build not found")
        
    if build.status != "preview_created":
        raise HTTPException(status_code=400, detail=f"Cannot publish build in status: {build.status}")
        
    build.status = "approved"
    build.opportunity.status = "approved"
    session.commit()
    
    # We will trigger the publishing/merge background tasks here once builder.py is ready
    
    return {"status": "queued", "message": f"Publishing build {build_id} in background"}
