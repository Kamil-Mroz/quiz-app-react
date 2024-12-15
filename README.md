# Instrukcje Setupu

## Konfiguracja Serwera

1. Przejdź do folderu backend<br>

```bash
   cd backend/
```

2. Zainstaluj zależności<br>

```bash
   npm install
```

3. Kompilacja pliki TypeScript<br>

```bash
   npx tsc --build
```

4. Stwórz plik .env w folderze dist/<br>
   PORT=3000<br>
   SECRET_KEY=2427aa<br>
5. Przenieś plik data.json, folder assets oraz folder uploads do folderu dist/

## Uruchomienie Serwera

npm run ts-start

## Konfiguracja Frontendu

1. Przejdź do folderu frontend/quiz<br>

```bash
   cd frontend/
```

2. Zainstaluj zależności<br>

```bash
   npm install
```

## Uruchom frontend

```bash
npm run dev
```
