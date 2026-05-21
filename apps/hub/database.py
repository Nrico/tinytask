from datetime import datetime
from typing import Optional, List
from sqlalchemy import create_engine, ForeignKey, String, Text, Boolean, Integer, Float, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker, relationship
from config import settings

engine = create_engine(settings.database_url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

class Signal(Base):
    __tablename__ = "signals"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    source: Mapped[str] = mapped_column(String(50))
    raw_content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    processed: Mapped[bool] = mapped_column(Boolean, default=False)

class Opportunity(Base):
    __tablename__ = "opportunities"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(100))
    problem: Mapped[str] = mapped_column(Text)
    target_user: Mapped[str] = mapped_column(Text)
    why_it_matters: Mapped[str] = mapped_column(Text)
    mvp_scope: Mapped[str] = mapped_column(Text)
    risks: Mapped[str] = mapped_column(Text)
    recommended_implementation: Mapped[str] = mapped_column(Text)
    
    score_pain: Mapped[int] = mapped_column(Integer, default=0)
    score_frequency: Mapped[int] = mapped_column(Integer, default=0)
    score_fit: Mapped[int] = mapped_column(Integer, default=0)
    score_simplicity: Mapped[int] = mapped_column(Integer, default=0)
    score_seo: Mapped[int] = mapped_column(Integer, default=0)
    score_monetization: Mapped[int] = mapped_column(Integer, default=0)
    score_risk: Mapped[int] = mapped_column(Integer, default=0)
    score_total: Mapped[float] = mapped_column(Float, default=0.0)
    
    status: Mapped[str] = mapped_column(String(50), default="discovered")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    builds: Mapped[List["Build"]] = relationship(back_populates="opportunity", cascade="all, delete-orphan")

class Build(Base):
    __tablename__ = "builds"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    opportunity_id: Mapped[int] = mapped_column(ForeignKey("opportunities.id"))
    branch_name: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(50), default="pending")
    pr_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    preview_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    test_results: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    repair_attempts: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    opportunity: Mapped["Opportunity"] = relationship(back_populates="builds")

class Metric(Base):
    __tablename__ = "metrics"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tool_slug: Mapped[str] = mapped_column(String(100))
    event_name: Mapped[str] = mapped_column(String(100))
    payload: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Experiment(Base):
    __tablename__ = "experiments"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tool_slug: Mapped[str] = mapped_column(String(100))
    name: Mapped[str] = mapped_column(String(100))
    variant_a_config: Mapped[str] = mapped_column(Text)
    variant_b_config: Mapped[str] = mapped_column(Text)
    metric_to_track: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(50), default="draft")
    winner: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

def init_db():
    import os
    from alembic.config import Config
    from alembic import command
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    ini_path = os.path.join(base_dir, "alembic.ini")
    
    cfg = Config(ini_path)
    cfg.set_main_option("script_location", os.path.join(base_dir, "alembic"))
    
    print("Running database migrations up to head...")
    command.upgrade(cfg, "head")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
