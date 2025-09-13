// Skenario pengujian: Pengguna dapat login ke aplikasi

describe('Login Flow', () => {
  beforeEach(() => {
    // Kunjungi halaman login sebelum setiap test
    cy.visit('/login');
  });

  it('should display login form', () => {
    // Memverifikasi bahwa form login ditampilkan dengan benar
    cy.get('form').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should show error message with invalid credentials', () => {
    // Intercept API call untuk login dengan error
    cy.intercept('POST', '**/v1/login', {
      statusCode: 401,
      body: {
        message: 'email or password is wrong',
      },
    }).as('loginError');

    // Mengisi form dengan kredensial yang tidak valid
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Menunggu API call selesai
    cy.wait('@loginError');

    // Memverifikasi pesan error ditampilkan
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'email or password is wrong');
  });

  it('should login successfully with valid credentials', () => {
    // Intercept API call untuk login
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          id: 'user-1',
          name: 'Test User',
          email: 'testuser@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Test+User',
        },
      },
    }).as('loginRequest');

    // Mengisi form dengan kredensial yang valid
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Menunggu API call selesai
    cy.wait('@loginRequest');

    // Memverifikasi redirect ke halaman threads setelah login berhasil
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Memverifikasi informasi user ditampilkan di navbar
    cy.get('[data-testid="user-info"]').should('exist');
    cy.get('[data-testid="user-name"]').should('contain', 'Test User');
  });

  it('should navigate to register page when register link is clicked', () => {
    // Klik link register
    cy.get('[data-testid="navbar-register-link"]').first().click();

    // Memverifikasi redirect ke halaman register
    cy.url().should('include', '/register');
  });

  it('should persist login state after page refresh', () => {
    // Setup localStorage dengan token dan user data
    cy.window().then((window) => {
      window.localStorage.setItem('token', 'fake-jwt-token');
      window.localStorage.setItem('user', JSON.stringify({
        id: 'user-1',
        name: 'Test User',
        email: 'testuser@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Test+User',
      }));
    });

    // Refresh halaman
    cy.reload();

    // Memverifikasi redirect ke halaman threads (karena sudah login)
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Memverifikasi informasi user tetap ditampilkan di navbar
    cy.get('[data-testid="user-info"]').should('exist');
    cy.get('[data-testid="user-name"]').should('contain', 'Test User');
  });
});