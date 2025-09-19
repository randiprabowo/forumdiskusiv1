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
    // Setup intercept untuk filtered threads
    cy.intercept('GET', '**/v1/threads**', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'success',
        data: {
          threads: [{
            id: 'thread-1',
            title: 'Thread Title 1',
            body: 'Thread body content',
            category: 'react',
            createdAt: '2023-05-30T10:00:00.000Z',
            owner: {
              id: 'user-1',
              name: 'Test User',
              avatar: 'https://ui-avatars.com/api/?name=Test+User'
            },
            upVotesBy: [],
            downVotesBy: [],
            totalComments: 0
          }]
        }
      }
    }).as('getFilteredThreads');

    // Klik filter kategori 'react'
    cy.get('[data-testid="category-filter"]').contains('react').should('be.visible').click();
    
    // Tunggu response filtered threads
    cy.wait('@getFilteredThreads');

    // Memverifikasi hanya thread dengan kategori 'react' yang ditampilkan
    cy.get('[data-testid="thread-item"]', { timeout: 10000 }).should('have.length', 1);
    cy.get('[data-testid="thread-item"]').should('contain', 'Thread Title 1');
  });

  it('should navigate to thread detail page when thread is clicked', () => {
    // Setup intercept untuk thread detail
    cy.interceptThreadDetail();
    
    // Wait for initial threads to load and be visible
    cy.get('[data-testid="thread-item"]').should('be.visible');

    // Klik thread pertama
    cy.get('[data-testid="thread-item"]').first().click();

    // Memverifikasi redirect ke halaman detail thread
    cy.url().should('include', '/threads/thread-1');

    // Menunggu detail thread dimuat
    cy.wait('@getThreadDetail');

    // Memverifikasi komponen thread detail ditampilkan
    cy.get('[data-testid="thread-title"]', { timeout: 10000 }).should('be.visible').and('contain', 'Thread Title 1');
    cy.get('[data-testid="thread-body"]', { timeout: 10000 }).should('be.visible').and('contain', 'Thread body with detailed content');
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