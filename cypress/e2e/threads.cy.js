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
    // Wait for initial threads to load
    cy.wait('@getThreads');
    
    // Verify initial thread list is visible
    cy.get('[data-testid="thread-item"]').should('have.length', 2);

    // Klik filter kategori 'react' setelah memastikan elemen ada dan visible
    cy.get('[data-testid="category-filter"]')
      .should('be.visible')
      .contains('react')
      .should('be.visible')
      .click();
    
    // Tunggu sebentar untuk proses filtering frontend
    cy.wait(500);

    // Memverifikasi hanya thread dengan kategori 'react' yang ditampilkan
    cy.get('[data-testid="thread-item"]', { timeout: 10000 }).should('have.length', 1);
    cy.get('[data-testid="thread-item"]').should('contain', 'Thread Title 1');
  });

  it('should navigate to thread detail page when thread is clicked', () => {
    // Wait for initial threads to load
    cy.wait('@getThreads');
    
    // Setup intercept untuk thread detail
    cy.interceptThreadDetail();
    
    // Wait for thread items to be visible and interactable with longer timeout for CI
    cy.get('[data-testid="thread-item"]', { timeout: 15000 })
      .should('be.visible')
      .first()
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // Memverifikasi redirect ke halaman detail thread with longer timeout
    cy.url({ timeout: 15000 }).should('include', '/threads/thread-1');

    // Menunggu detail thread dimuat dengan timeout yang lebih lama untuk CI
    cy.wait('@getThreadDetail', { timeout: 15000 });

    // Memverifikasi komponen thread detail ditampilkan dengan retry assertions dan timeout lebih lama
    cy.get('[data-testid="thread-title"]', { timeout: 15000 })
      .should('exist')
      .and('be.visible')
      .and('contain', 'Thread Title 1');
      
    cy.get('[data-testid="thread-body"]', { timeout: 15000 })
      .should('exist')
      .and('be.visible')
      .and('contain', 'Thread body with detailed content');
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