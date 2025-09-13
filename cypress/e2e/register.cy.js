// Skenario pengujian: Pengguna dapat mendaftar akun baru

describe('Register Flow', () => {
  beforeEach(() => {
    // Kunjungi halaman register
    cy.visit('/register');
  });

  it('should display register form', () => {
    // Memverifikasi form register ditampilkan
    cy.get('[data-testid="register-form"]').should('exist');
    cy.get('[data-testid="name-input"]').should('exist');
    cy.get('[data-testid="email-input"]').should('exist');
    cy.get('[data-testid="password-input"]').should('exist');
    cy.get('[data-testid="register-button"]').should('exist');
  });

  it('should show error when submitting with invalid data', () => {
    // Klik tombol register tanpa mengisi form
    cy.get('[data-testid="register-button"]').click();

    // Memverifikasi pesan error ditampilkan
    cy.get('[data-testid="error-message"]').should('exist');
    cy.get('[data-testid="error-message"]').should('contain', 'Nama tidak boleh kosong');
  });

  it('should register successfully with valid data', () => {
    // Menggunakan fixture untuk data pengguna baru
    cy.fixture('users').then(({ newUser }) => {
      // Intercept API call untuk register
      cy.intercept('POST', '**/register', {
        statusCode: 201,
        body: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar
          }
        },
      }).as('registerUser');

      // Mengisi form register
      cy.get('[data-testid="name-input"]').type(newUser.name);
      cy.get('[data-testid="email-input"]').type(newUser.email);
      cy.get('[data-testid="password-input"]').type(newUser.password);
      cy.get('[data-testid="register-button"]').click();

      // Memverifikasi API call untuk register
      cy.wait('@registerUser');

      // Memverifikasi redirect ke halaman login
      cy.url().should('include', '/login');

      // Memverifikasi pesan sukses ditampilkan
      cy.get('[data-testid="success-message"]').should('exist');
      cy.get('[data-testid="success-message"]').should('contain', 'Registrasi berhasil');
    });
  });

  it('should show error when registering with existing email', () => {
    // Menggunakan fixture untuk data pengguna yang sudah ada
    cy.fixture('users').then(({ validUser }) => {
      // Intercept API call untuk register dengan error
      cy.intercept('POST', '**/register', {
        statusCode: 400,
        body: {
          message: 'Email sudah terdaftar'
        },
      }).as('registerExistingUser');

      // Mengisi form register dengan email yang sudah ada
      cy.get('[data-testid="name-input"]').type('New User');
      cy.get('[data-testid="email-input"]').type(validUser.email);
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="register-button"]').click();

      // Memverifikasi API call untuk register
      cy.wait('@registerExistingUser');

      // Memverifikasi pesan error ditampilkan
      cy.get('[data-testid="error-message"]').should('exist');
      cy.get('[data-testid="error-message"]').should('contain', 'Email sudah terdaftar');
    });
  });

  it('should navigate to login page when login link is clicked', () => {
    // Klik link login
    cy.get('[data-testid="login-link"]').click();

    // Memverifikasi redirect ke halaman login
    cy.url().should('include', '/login');
  });
});