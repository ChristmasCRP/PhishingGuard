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
* [Testy E2E (Playwright)](#testy-e2e-playwright)
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
├── backend/                # Logika serwera (API)
│   ├── main.py             # Punkt startowy aplikacji (FastAPI)
│   ├── crud.py             # Operacje na bazie danych (MongoDB)
│   ├── auth.py             # Logika logowania i tokenów JWT
│   ├── schemas.py          # Modele danych Pydantic
│   ├── database.py         # Konfiguracja połączenia z MongoDB
│   └── requirements.txt    # Lista zależności Python
├── frontend/               # Aplikacja kliencka (React + Vite)
│   ├── src/
│   │   ├── api/            # Komunikacja z API (Axios)
│   │   ├── components/     # Reużywalne komponenty (Navbar, Modale)
│   │   └── pages/          # Widoki stron (Dashboard, Quiz)
│   └── package.json        # Zależności Node.js
└── projekt-playwright-e2e/ # Automatyczne testy end-to-end
    ├── e2e/
    │   └── testy.spec.ts   # Scenariusze testowe
    ├── playwright.config.ts # Konfiguracja frameworka Playwright
    └── package.json        # Zależności narzędzi testowych
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

## Testy E2E (Playwright)
W projekcie zaimplementowano automatyczne testy end-to-end zapewniające stabilność krytycznych funkcji.
    Opis scenariuszy:
         
         1. Logowanie Administratora: Sprawdzenie autoryzacji oraz dynamicznej zmiany elementów interfejsu (widoczność przycisku wylogowania).

        2. Dodawanie pytania (CRUD): Weryfikacja formularza dodawania pytania w panelu admina wraz z obsługą systemowych okien dialogowych (alertów).

        3. Rejestracja: Test tworzenia unikalnego konta użytkownika i automatycznego logowania po rejestracji.

        4. Rozwiązywanie Quizu: Weryfikacja ścieżki użytkownika od wyboru kategorii do otrzymania końcowego wyniku.

        5. Wylogowanie: Sprawdzenie wylogowywania się i powrotu do ekranu startowego.

        6. Walidacja Logowania: Test negatywny sprawdzający reakcję systemu na błędne hasło (komunikat "Incorrect email or password").

Uruchamianie testów:

         1. cd projekt-playwright-e2e
         2. npx playwright test --ui

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
Testy: [Jakub Danilkiewicz] - Playwright
Frontend: [Paweł Glaza] - interfejs użytkownika, React, komunikacja z API.
```
