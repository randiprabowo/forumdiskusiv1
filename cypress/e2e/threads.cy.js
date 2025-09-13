// Skenario pengujian: Pengguna dapat melihat dan membuat thread

describe('Threads Flow', () => {
  beforeEach(() => {
    // Setup localStorage dengan token dan user data untuk simulasi user yang sudah login
    cy.setupLoggedInUser();
    
    // Setup intercept untuk threads
    cy.interceptThreads();
    
    // Kunjungi halaman utama
    cy.visit('/');
    cy.wait('@getThreads');
  });

  it('should display list of threads', () => {
    // Memverifikasi daftar thread ditampilkan
    cy.get('[data-testid="thread-item"]').should('have.length', 2);
    cy.get('[data-testid="thread-item"]').first().should('contain', 'Thread Title 1');
    cy.get('[data-testid="thread-item"]').last().should('contain', 'Thread Title 2');
  });

  it('should filter threads by category', () => {
    // Klik filter kategori 'react'
    cy.get('[data-testid="category-filter"]').contains('react').click();

    // Memverifikasi hanya thread dengan kategori 'react' yang ditampilkan
    cy.get('[data-testid="thread-item"]').should('have.length', 1);
    cy.get('[data-testid="thread-item"]').should('contain', 'Thread Title 1');
  });

  it('should navigate to thread detail page when thread is clicked', () => {
    // Setup intercept untuk thread detail
    cy.interceptThreadDetail('thread-1');

    // Klik thread pertama
    cy.get('[data-testid="thread-item"]').first().click();

    // Memverifikasi redirect ke halaman detail thread
    cy.url().should('include', '/threads/thread-1');

    // Menunggu detail thread dimuat
    cy.wait('@getThreadDetail');

    // Memverifikasi detail thread ditampilkan
    cy.get('[data-testid="thread-detail"]').should('exist');
    cy.get('[data-testid="thread-title"]').should('contain', 'Thread Title 1');
  });

  it('should create a new thread', () => {
    // Klik tombol create thread
    cy.get('[data-testid="create-thread-button"]').click();

    // Memverifikasi redirect ke halaman create thread
    cy.url().should('include', '/threads/new');

    // Menggunakan custom command untuk membuat thread baru
    cy.createThread();

    // Memverifikasi redirect ke halaman threads setelah thread berhasil dibuat
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});