# PhishingGuard

> Interaktywna platforma edukacyjna zwiększająca świadomość na temat cyberzagrożeń i phishingu.

PhishingGuard to aplikacja webowa typu Fullstack stworzona w ramach projektu studenckiego. Jej celem jest edukacja użytkowników poprzez rozwiązywanie interaktywnych quizów, które uczą rozpoznawania fałszywych wiadomości e-mail, stron internetowych i prób wyłudzenia danych. Aplikacja posiada system ról (użytkownik/admin), co pozwala na dynamiczne zarządzanie bazą pytań i treściami edukacyjnymi.

## Spis treści
* [Technologie](#technologie)
* [Funkcjonalności](#funkcjonalności)
* [Struktura Projektu](#struktura-projektu)
* [Instalacja i Uruchomienie](#instalacja-i-uruchomienie)
* [Konfiguracja](#konfiguracja)
* [API Endpoints](#api-endpoints)
* [Status Projektu](#status-projektu)
* [Autorzy](#autorzy)

## Technologie

Projekt został podzielony na dwie części: API (Backend) oraz Klienta (Frontend).

**Backend:**
*   **Python 3.12+**
*   **FastAPI** - nowoczesny, wysokowydajny framework do budowania API.
*   **MongoDB (Motor)** - asynchroniczna baza danych NoSQL.
*   **Authentication** - JWT (JSON Web Tokens) & BCrypt (haszowanie haseł).

**Frontend:**
*   **React 18** - biblioteka interfejsu użytkownika.
*   **Vite** - narzędzie do budowania i serwowania aplikacji (HMR).
*   **Axios** - klient HTTP do komunikacji z API.
*   **React Router DOM** - obsługa routingu (SPA).
*   **Tailwinds** - stylowanie komponentów (responsywny design).

## Funkcjonalności

*  **Autoryzacja i Uwierzytelnianie:**
    *   Rejestracja i logowanie użytkowników.
    *   Zabezpieczone endpointy (wymagany Bearer Token).
    *   Obsługa sesji i wylogowywania.
*  **System Quizów:**
    *   Quizy podzielone na kategorie (np. Podstawy, Hasła, Socjotechnika).
    *   Filtrowanie pytań po ID quizu.
    *   Weryfikacja odpowiedzi po stronie serwera (Backend Validation).
    *   Obsługa pytań multimedialnych (załączniki wizualne URL).
*  **Panel Administratora (Dashboard):**
    *   Pełny CRUD pytań (Dodawanie, Edycja, Usuwanie).
    *   Zarządzanie kluczem odpowiedzi.
    *   Widok dostępny tylko dla użytkowników z rolą `admin`.
*  **Interfejs Użytkownika:**
    *   Landing page z informacjami o projekcie.
    *   Responsywny pasek nawigacji.
    *   Modalne okna autoryzacji.

## Struktura Projektu

```
PhishingGuard/
├── backend/            # Logika serwera (API)
│   ├── main.py         # Punkt startowy aplikacji (FastAPI)
│   ├── crud.py         # Operacje na bazie danych (MongoDB)
│   ├── auth.py         # Logika logowania, haszowania i tokenów JWT
│   ├── schemas.py      # Modele danych Pydantic (User, Question, Quiz)
│   ├── database.py     # Konfiguracja połączenia z MongoDB
│   ├── config.py       # Obsługa zmiennych środowiskowych
│   └── requirements.txt # Lista zależności Python
└── frontend/           # Aplikacja kliencka (React + Vite)
    ├── public/         # Zasoby statyczne
    ├── src/
    │   ├── api/        # Funkcje łączące z backendem (Axios)
    │   ├── components/ # Reużywalne elementy (Navbar, AuthModal, Dashboard)
    │   ├── pages/      # Główne widoki (LandingPage, QuizPage, QuizList)
    │   ├── App.jsx     # Główny komponent i konfiguracja Routera
    │   └── main.jsx    # Punkt wejścia aplikacji React
    └── package.json    # Konfiguracja projektu Node.js
```


## Instalacja i Uruchomienie

Aby uruchomić projekt, potrzebny jest zainsatlowany Node.js, Pythona oraz dostępu do bazy MongoDB (lokalnie lub Atlas).
### 1. Backend (Serwer)
Otwórz terminal w folderze projektu:

cd backend

### Tworzenie środowiska wirtualnego
python -m venv venv

### Aktywacja środowiska (Windows)
.\venv\Scripts\activate

### Instalacja zależności
pip install -r requirements.txt

### Uruchomienie serwera (nasłuchuje na porcie 8000)
uvicorn main:app --reload

### 2. Frontend (Klient)
Otwórz drugi terminal w folderze projektu:

cd frontend

### Instalacja bibliotek
npm install

### Uruchomienie serwera developerskiego (nasłuchuje na porcie 5173)
npm run dev

Aplikacja będzie dostępna w przeglądarce pod adresem: http://localhost:5173

## Konfiguracja
Zmienne środowiskowe (.env)
W katalogu backend/ utwórz plik .env. Jest on ignorowany przez Gita ze względów bezpieczeństwa. Uzupełnij go swoimi danymi:

MONGO_URI=mongodb+srv://<twoj_login>:<twoje_haslo>@cluster.mongodb.net/?retryWrites=true&w=majority
SECRET_KEY=twoj_bardzo_tajny_i_dlugi_klucz_do_szyfrowania_jwt

Nadawanie uprawnień Administratora
Domyślnie każdy nowo zarejestrowany użytkownik otrzymuje rolę user. Aby uzyskać dostęp do panelu administratora:
Zarejestruj się w aplikacji przez formularz na stronie.
Zaloguj się do swojej bazy danych (np. przez MongoDB Compass).
Znajdź dokument swojego użytkownika w kolekcji users.
Edytuj dokument, dodając lub zmieniając pole: "role": "admin".
Przeładuj aplikację frontendową – teraz masz dostęp do ścieżek /admin i edycji quizów.

## API Endpoints
```
Główne punkty końcowe dostępne w Backendzie (dokumentacja Swagger pod /docs):
Auth:
POST /register - Rejestracja użytkownika.
POST /login - Logowanie i pobieranie tokena.
Users:
GET /users/me - Pobranie profilu zalogowanego użytkownika.
PUT /users/me/password - Zmiana hasła.
DELETE /users/me - Usunięcie konta.
Quiz (Public & User):
GET /quiz - Pobranie wszystkich pytań.
GET /quiz/{quiz_id} - Pobranie pytań dla konkretnego quizu.
POST /quiz/check - Sprawdzenie poprawności odpowiedzi.
Admin (wymagana rola 'admin'):
POST /admin/questions - Dodanie nowego pytania.
PUT /admin/quiz/{id} - Edycja pytania.
DELETE /admin/quiz/{id} - Usunięcie pytania.
```
## Status Projektu
Projekt ukończony (MVP).
Główne funkcjonalności (logowanie, system quizów, panel admina) działają poprawnie.


**Możliwe kierunki rozwoju:**

Historia wyników i statystyki użytkownika.
Upload obrazków bezpośrednio na serwer (zamiast linków URL).
System rankingów (Leaderboard).
Resetowanie hasła przez e-mail.


## Autorzy
```
Projekt zrealizowany w ramach studiów.
Backend: [Jakub Danilkiewicz] - architektura API, baza danych, logika biznesowa.
Frontend: [Paweł Glaza] - interfejs użytkownika, React, komunikacja z API.
```
