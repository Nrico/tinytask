import database as db
from database import SessionLocal, Opportunity

def seed():
    session = SessionLocal()
    # Check if jar-label-generator already exists
    opp = session.query(Opportunity).filter(Opportunity.slug == "jar-label-generator").first()
    if not opp:
        opp = Opportunity(
            slug="jar-label-generator",
            title="Jar Label Generator",
            problem="Small-batch food producers, hobbyists, and home cooks need a quick way to design and print professional jar labels that fit standard label sheets.",
            target_user="Home cooks, jam/canning hobbyists, small artisanal producers",
            why_it_matters="Professional product packaging makes homemade goods look premium, and existing tools are either overly generic or require paid subscriptions.",
            mvp_scope="Select shape (round, oval, rectangle), input text (brand, product name, ingredients/subtext), customize background/font colors, load presets, and print standard sheet grids.",
            risks="Print alignment mismatch across different browsers and printers.",
            recommended_implementation="Fast Next.js page leveraging shared brand style and CSS @media print utilities for perfect sheet pagination.",
            score_pain=7,
            score_frequency=5,
            score_fit=8,
            score_simplicity=9,
            score_seo=8,
            score_monetization=4,
            score_risk=3,
            score_total=7.0,
            status="discovered"
        )
        session.add(opp)
        session.commit()
        print("Jar Label Generator opportunity seeded successfully.")
    else:
        print("Jar Label Generator opportunity already exists.")
    session.close()

if __name__ == "__main__":
    seed()
