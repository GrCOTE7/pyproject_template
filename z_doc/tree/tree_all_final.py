import os

EXCLUDE = {".git", ".github", ".vscode", ".venv", "node_modules", "__pycache__"}


# ---------------------------------------------------------
# 1) VERSION ASCII (inchangée)
# ---------------------------------------------------------
def tree_ascii(path=".", prefix=""):
    entries = [e for e in os.listdir(path) if e not in EXCLUDE]

    # Séparer dossiers et fichiers
    dirs = [e for e in entries if os.path.isdir(os.path.join(path, e))]
    files = [e for e in entries if not os.path.isdir(os.path.join(path, e))]

    for i, entry in enumerate(dirs + files):
        full_path = os.path.join(path, entry)
        is_last = i == len(dirs + files) - 1

        connector = "└── " if is_last else "├── "
        child_prefix = "    " if is_last else "│   "

        print(prefix + connector + entry)

        if os.path.isdir(full_path):
            tree_ascii(full_path, prefix + child_prefix)


# ---------------------------------------------------------
# 2) VERSION MARKMAP (listes Markdown imbriquées)
# ---------------------------------------------------------
def tree_markmap(path=".", indent=0):
    entries = [e for e in os.listdir(path) if e not in EXCLUDE]

    # Séparer dossiers et fichiers
    dirs = [e for e in entries if os.path.isdir(os.path.join(path, e))]
    files = [e for e in entries if not os.path.isdir(os.path.join(path, e))]

    # Trier alphabétiquement si tu veux
    dirs.sort(key=str.lower)
    files.sort(key=str.lower)

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

    # Default: . - Example: "backend/django"
    # folder = "backend/django"
    folder = "."

    projectName = "Root" if folder == "." else folder
    # --- ASCII ---
    with open("STRUCTURE.md", "w", encoding="utf-8") as f:
        original = sys.stdout
        sys.stdout = f

        print("```text")
        tree_ascii(folder)
        print("```")

        sys.stdout = original

    print("STRUCTURE.md généré avec succès.")

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
        print(f"# {projectName}\n")

        tree_markmap(folder, indent=0)

        sys.stdout = original

    print("STRUCTURE_MARKMAP.md généré avec succès.")
