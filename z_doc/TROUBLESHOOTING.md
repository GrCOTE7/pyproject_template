# 🔧 Guide de dépannage - Problèmes d'installation

## Problème : Erreur de connexion lors de l'installation

### Symptôme
```
ERROR: Could not find a version that satisfies the requirement fastapi
[Errno 11001] getaddrinfo failed
```

### Causes possibles
1. ❌ Pas de connexion internet
2. ❌ Problème DNS
3. ❌ Firewall/Proxy bloquant PyPI
4. ❌ VPN actif avec restrictions

---

## ✅ Solutions (par ordre de priorité)

### Solution 1 : Vérifier la connexion
```powershell
# Test de connectivité PyPI
Test-NetConnection pypi.org -Port 443
```

### Solution 2 : Changer de miroir PyPI (si en Chine/réseau restreint)
```powershell
# Utiliser un miroir (exemple: Aliyun)
pip install -r backend\requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# Ou Tsinghua
pip install -r backend\requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### Solution 3 : Configuration proxy
```powershell
# Si vous êtes derrière un proxy d'entreprise
$env:HTTP_PROXY="http://proxy.entreprise.com:8080"
$env:HTTPS_PROXY="http://proxy.entreprise.com:8080"
pip install -r backend\requirements.txt
```

### Solution 4 : Installation hors ligne (si aucune connexion)

#### Étape 1 : Sur une machine avec internet
```powershell
# Télécharger les packages
pip download -r backend\requirements.txt -d packages_fastapi
pip download -r backend\django\requirements.txt -d packages_django
pip download -r frontend\requirements.txt -d packages_frontend
```

#### Étape 2 : Transférer le dossier "packages_*" sur votre machine

#### Étape 3 : Installer en local
```powershell
pip install --no-index --find-links=packages_fastapi -r backend\requirements.txt
pip install --no-index --find-links=packages_django -r backend\django\requirements.txt
```

### Solution 5 : Désactiver temporairement VPN/Antivirus
Certains VPN ou antivirus bloquent les connexions à PyPI.

---

## 🚀 Installation manuelle (alternative à setup.bat)

Si `setup.bat` ne fonctionne pas, voici les étapes manuelles :

### 1. Backend FastAPI
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install fastapi uvicorn[standard] python-dotenv
cd ..
```

### 2. Backend Django
```powershell
cd backend
.\.venv\Scripts\activate
cd django
pip install Django django-browser-reload django-cors-headers python-dotenv
python manage.py migrate
cd ..\..
```

### 3. Frontend
```powershell
cd frontend
npm install
cd ..
```

---

## ⚡ Lancer l'application sans réinstallation

Si les packages étaient déjà installés avant :

```powershell
# Activer l'environnement
backend\.venv\Scripts\activate

# Vérifier ce qui est installé
pip list

# Lancer directement
.\start.bat
```

---

## 📋 Vérification de l'installation

### Vérifier Python et pip
```powershell
python --version
pip --version
pip config list
```

### Tester l'installation des packages
```powershell
python -c "import fastapi; print('FastAPI:', fastapi.__version__)"
python -c "import django; print('Django:', django.__version__)"
```

---

## 🆘 Besoin d'aide ?

1. Vérifiez votre connexion : `ping pypi.org`
2. Testez avec un package simple : `pip install requests`
3. Si ça fonctionne, réessayez l'installation complète
4. Si ça ne fonctionne pas, contactez votre administrateur réseau

---

## 📦 Packages requis minimum

**FastAPI (backend):**
- fastapi
- uvicorn[standard]
- python-dotenv

**Django (backend/django):**
- Django
- django-browser-reload
- django-cors-headers
- python-dotenv

**Frontend:**
- Voir package.json (npm)
