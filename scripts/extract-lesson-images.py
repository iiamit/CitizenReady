"""
One-time script: extracts lesson images from the USCIS 2025 Civics Study Guide PDF.
Run from the project root:
  py -3 scripts/extract-lesson-images.py

Requires: pip install pypdf pillow
Output: scripts/raw_images/<category>/<name>.<ext>
Then run: node scripts/optimize-images.js
"""

import os
import sys

try:
    from pypdf import PdfReader
except ImportError:
    print("pypdf not found. Run: py -3 -m pip install pypdf")
    sys.exit(1)

PDF_PATH = os.environ.get(
    "USCIS_PDF",
    r"C:\Users\iamit\Downloads\USCIS-2025-Civics-Test-Study-Guide.pdf"
)

OUT_DIR = os.path.join(os.path.dirname(__file__), "raw_images")

# Maps: (page_number_1based, image_index_0based) -> (category, output_name)
IMAGE_MAP = {
    # constitution
    (9,  0): ("constitution",    "signing.jpg"),
    (16, 0): ("constitution",    "ratification-map.jpg"),

    # branches
    (11, 0): ("branches",        "capitol.jpg"),
    (30, 0): ("branches",        "supreme-court-justices.jpg"),
    (31, 1): ("branches",        "supreme-court-room.jpg"),

    # rights-freedoms
    (33, 1): ("rights-freedoms", "bill-of-rights.jpg"),
    (34, 0): ("rights-freedoms", "federalist-papers.jpg"),
    (36, 0): ("rights-freedoms", "naturalization.jpg"),

    # president
    (25, 1): ("president",       "cabinet.jpg"),
    (27, 0): ("president",       "presidents.jpg"),
    (53, 0): ("president",       "washington-oath.jpg"),

    # geography
    (39, 0): ("geography",       "us-map.jpg"),
    (40, 0): ("geography",       "us-borders.jpg"),
    (41, 0): ("geography",       "us-rivers.jpg"),

    # colonial
    (44, 0): ("colonial",        "jamestown.jpg"),
    (44, 1): ("colonial",        "pomeiock.jpg"),
    (45, 0): ("colonial",        "slavery-routes.jpg"),
    (46, 0): ("colonial",        "thirteen-colonies.jpg"),
    (48, 0): ("colonial",        "washington-command.jpg"),
    (48, 1): ("colonial",        "washington-princeton.jpg"),
    (49, 0): ("colonial",        "declaration.jpg"),
    (50, 0): ("colonial",        "yorktown.jpg"),
    (50, 1): ("colonial",        "benjamin-franklin.jpg"),

    # civil-war
    (58, 0): ("civil-war",       "civil-war-battle.jpg"),
    (59, 0): ("civil-war",       "douglass.jpg"),
    (59, 1): ("civil-war",       "anthony.jpg"),
    (60, 0): ("civil-war",       "lincoln.jpg"),
    (61, 0): ("civil-war",       "juneteenth.jpg") if False else None,  # skip if no image on 61

    # recent-history
    (63, 0): ("recent-history",  "wwi-trenches.jpg"),
    (64, 0): ("recent-history",  "fdr-signing.jpg"),
    (64, 1): ("recent-history",  "pearl-harbor.jpg"),
    (65, 0): ("recent-history",  "cold-war-map.jpg"),
    (66, 0): ("recent-history",  "mlk-march.jpg"),
    (67, 0): ("recent-history",  "911-pentagon.jpg"),
    (67, 1): ("recent-history",  "911-wtc.jpg"),

    # symbols-holidays
    (69, 0): ("symbols-holidays","statue-liberty.jpg"),
    (70, 0): ("symbols-holidays","ellis-island.jpg"),
    (70, 1): ("symbols-holidays","ellis-island-hall.jpg"),
    (71, 0): ("symbols-holidays","american-flag.jpg"),
    (72, 0): ("symbols-holidays","star-spangled-banner.jpg"),
    (73, 0): ("symbols-holidays","washington-portrait.jpg"),
    (73, 2): ("symbols-holidays","lincoln-portrait.jpg"),
    (74, 1): ("symbols-holidays","arlington-cemetery.jpg"),
    (75, 0): ("symbols-holidays","iwo-jima.jpg"),
}


def extract():
    if not os.path.exists(PDF_PATH):
        print(f"PDF not found at: {PDF_PATH}")
        print("Set USCIS_PDF env var to point to the PDF.")
        sys.exit(1)

    print(f"Reading PDF: {PDF_PATH}")
    reader = PdfReader(PDF_PATH)
    total = len(reader.pages)
    print(f"Total pages: {total}")

    saved = 0
    skipped = 0

    for (pg, img_idx), dest in IMAGE_MAP.items():
        if dest is None:
            continue
        category, name = dest

        if pg > total:
            print(f"  SKIP  p.{pg} — beyond PDF length")
            skipped += 1
            continue

        page = reader.pages[pg - 1]
        try:
            images = list(page.images)
        except Exception as e:
            print(f"  ERROR p.{pg} reading images: {e}")
            skipped += 1
            continue

        if img_idx >= len(images):
            print(f"  SKIP  p.{pg}[{img_idx}] — only {len(images)} image(s) on page")
            skipped += 1
            continue

        img = images[img_idx]

        out_dir = os.path.join(OUT_DIR, category)
        os.makedirs(out_dir, exist_ok=True)

        # Use the name we specified (override the PDF's internal name extension if needed)
        ext = img.name.split(".")[-1].lower()
        # Force the output name we chose; if it has a different extension, keep it
        out_name = name
        # If the PDF image is jp2, save as-is and let sharp convert later
        out_path = os.path.join(out_dir, out_name)

        with open(out_path, "wb") as f:
            f.write(img.data)

        size_kb = len(img.data) // 1024
        print(f"  OK    p.{pg}[{img_idx}] -> {category}/{out_name} ({size_kb} KB, {ext})")
        saved += 1

    print(f"\nDone. Saved: {saved}, Skipped: {skipped}")
    print(f"Output: {OUT_DIR}")
    print("Next: run  node scripts/optimize-images.js")


if __name__ == "__main__":
    extract()
