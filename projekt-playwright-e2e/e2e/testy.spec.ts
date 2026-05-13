import { test, expect } from '@playwright/test';

//TEST 1 - LOGOWANIE SIĘ NA KONTO ADMINISTRATORA (SPRAWDZENIE CZY PRZYCISKI ZALOGUJ/WYLOGUJ SIĘ ZMIENIĄ)
test('logowanie admina', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
  await page.getByRole('textbox', { name: 'Hasło' }).fill('adminhaslo');

  await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();
  await expect(page).toHaveURL('http://localhost:5173/'); 
  const wylogujBtn = page.getByRole('button', { name: 'Wyloguj' });
  await expect(wylogujBtn).toBeVisible();

  const zalogujSieBtn = page.getByRole('button', { name: 'Zaloguj się' });
  await expect(zalogujSieBtn).toBeHidden(); 
});

//TEST 2 - DODAWANIE NOWEGO PYTANIA DO QUIZU
test('Administrator powinien móc dodać nowe pytanie do quizu', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
  await page.getByRole('textbox', { name: 'Hasło' }).fill('adminhaslo');
  await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();
  await page.getByRole('link', { name: 'Quizy' }).click();
  await page.getByRole('button', { name: 'Edytuj pytania' }).first().click();
  const trescPytania = `Nowe pytanie testowe ${Date.now()}`;
  await page.getByRole('textbox', { name: 'Wpisz treść pytania...' }).fill(trescPytania);
  
  await page.getByRole('radio').nth(1).check();
  await page.getByRole('textbox', { name: 'Opcja 1' }).fill('odpowiedz bledna');
  await page.getByRole('textbox', { name: 'Opcja 2' }).fill('odpowiedz poprawna');
  await page.getByRole('textbox', { name: 'Opcja 3' }).fill('odpowiedz bledna');
  await page.getByRole('textbox', { name: 'Opcja 4' }).fill('odpowiedz bledna');
  
  await page.getByRole('textbox', { name: 'https://example.com/image.png' })
    .fill('https://www.techsmith.com/blog/what-is-hi-res/');
  
  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('Pytanie dodane!');
    await dialog.accept();
  });
  
  await page.getByRole('button', { name: 'Opublikuj pytanie' }).click();
  await page.getByRole('link', { name: 'Quizy' }).click();
  await page.getByRole('button', { name: 'Edytuj pytania' }).first().click();
  await expect(page.getByText(trescPytania)).toBeVisible({ timeout: 10000 });
});

//TEST 3 - REJESTRACJA
test('Nowy użytkownik powinien móc założyć konto', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await page.getByText('Zarejestruj się').click(); 

  const uniqueId = Date.now();
  const username = `user_${uniqueId}`;
  const email = `test_${uniqueId}@example.com`;
  const password = 'TestPassword123!';

  await page.getByPlaceholder('Nickname').fill(username);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Hasło').fill(password);

  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Rejestracja udana');
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Utwórz konto' }).click();
  
  await expect(page.getByRole('button', { name: 'Zaloguj się' })).toBeVisible();
  
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Hasło' }).fill(password);
  await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();
  await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible();
});

//TEST 4 - ROZWIĄZYWANIE QUIZU I SPRAWDZENIE WYNIKU
test('Użytkownik powinien móc rozwiązać quiz i zobaczyć wynik 3/3', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('osoba3@com.com');
  await page.getByRole('textbox', { name: 'Hasło' }).fill('osobahaslo');
  await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();

  await page.getByRole('link', { name: 'Przejdź do quizów' }).click();
  await page.getByRole('button', { name: 'Rozpocznij quiz' }).nth(1).click();

  await page.getByRole('button', { name: 'Program, który bezpiecznie' }).click();
  await page.getByRole('button', { name: 'Następne pytanie' }).click();

  await page.getByRole('button', { name: 'K@wa!-.Herbata#9919%' }).click();
  await page.getByRole('button', { name: 'Następne pytanie' }).click();

  await page.getByRole('button', { name: 'Jeśli hakerzy wykradną hasło' }).click();
  await page.getByRole('button', { name: 'Zakończ quiz' }).click();

  await expect(page.getByText('Koniec Quizu! 🏆')).toBeVisible();
  await expect(page.getByText('Twój wynik: 3 / 3')).toBeVisible();
});

//TEST 5 - WYLOGOWANIE UŻYTKOWNIKA I POWRÓT DO EKRANU STARTOWEGO
test('Użytkownik powinien móc się wylogować', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
  await page.getByRole('textbox', { name: 'Hasło' }).fill('adminhaslo');
  await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();

  const wylogujBtn = page.getByRole('button', { name: 'Wyloguj' });
  await expect(wylogujBtn).toBeVisible();

  await wylogujBtn.click();

  await expect(wylogujBtn).toBeHidden();
  await expect(page.getByRole('button', { name: 'Zaloguj się' })).toBeVisible();
});

//TEST 6 - WALIDACJA FORMULARZA LOGOWANIA (BŁĘDNE DANE)
test('Aplikacja powinna wyświetlić błąd przy błędnym hasle', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
  await page.getByRole('textbox', { name: 'Hasło' }).fill('zle_haslo_123');
  await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();
  await expect(page.getByText('Incorrect email or password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeHidden();
});