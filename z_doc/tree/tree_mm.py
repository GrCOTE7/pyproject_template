import os

EXCLUDE = {".git", ".github", ".vscode", ".venv", "node_modules", "__pycache__"}


# ---------------------------------------------------------
# VERSION MARKMAP (listes Markdown imbriquées)
# ---------------------------------------------------------
def tree_markmap(path, indent=0):
    entries = [e for e in os.listdir(path) if e not in EXCLUDE]
    
    # Séparer dossiers et fichiers
    dirs = [e for e in entries if os.path.isdir(os.path.join(path, e))]
    files = [e for e in entries if not os.path.isdir(os.path.join(path, e))]

    # Trier alphabétiquement si tu veux
    dirs.sort()
    files.sort()

    for entry in dirs + files:
        full_path = os.path.join(path, entry)

        # Dossiers repliés par défaut
        if os.path.isdir(full_path):
            print(" " * indent + f"- 📁{entry} <!-- markmap: fold -->")
            tree_markmap(full_path, indent + 2)
        else:
            print(" " * indent + f"- {entry}")


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------
if __name__ == "__main__":
    import sys

    # --- MARKMAP ---
    with open("STRUCTURE_MARKMAP.md", "w", encoding="utf-8") as f:
        original = sys.stdout
        sys.stdout = f

        # Front‑matter Markmap
        print("---")
        print("markmap:")
        print("  duration: 2100")
        print("  initialExpandLevel: -1")
        print("---")
        print("# Projet\n")

        tree_markmap(".", indent=0)

        sys.stdout = original

    print("STRUCTURE_MARKMAP.md généré avec succès.")
