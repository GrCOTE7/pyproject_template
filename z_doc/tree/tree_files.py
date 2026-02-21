import flet, os

# ❌ pymox-toolkit opé (cls, ls)
# ❌ dépôt des map.md, dans le même folder (os.path...) observable quelque soit le dossier de lancement
# ❌ New page (+ lien footer) filemap

EXCLUDE = {".git", ".github", ".vscode", ".venv", "node_modules", "__pycache__"}


def tree(path, prefix=""):
    # Liste des entrées (fichiers + dossiers)
    entries = [e for e in os.listdir(path) if e not in EXCLUDE]
    entries.sort()

    for i, entry in enumerate(entries):
        full_path = os.path.join(path, entry)
        is_last = i == len(entries) - 1

        connector = "└── " if is_last else "├── "
        child_prefix = "    " if is_last else "│   "

        print(prefix + connector + entry)

        # Si c'est un dossier, on descend
        if os.path.isdir(full_path):
            tree(full_path, prefix + child_prefix)


if __name__ == "__main__":
    with open("STRUCTURE.md", "w", encoding="utf-8") as f:
        import sys

        # ❌ cls()
        print("Génération de STRUCTURE.md...")
        # ❌ sl()

        exit()

        original_stdout = sys.stdout
        sys.stdout = f

        print("```text")
        tree(".")
        print("```")

        sys.stdout = original_stdout

    print("STRUCTURE.md généré avec succès.")
