// Skenario pengujian: Pengguna dapat melihat leaderboard

describe('Leaderboard Flow', () => {
  beforeEach(() => {
    // Setup localStorage dengan token dan user data untuk simulasi user yang sudah login
    cy.setupLoggedInUser();
    
    // Setup intercept untuk leaderboards
    cy.interceptLeaderboards();
    
    // Kunjungi halaman leaderboard
    cy.visit('/leaderboard');
    cy.wait('@getLeaderboards');
  });

  it('should display leaderboard with user scores', () => {
    // Memverifikasi data leaderboard ditampilkan
    cy.get('[data-testid="leaderboard-item"]').should('have.length', 3);
    
    // Memverifikasi urutan leaderboard berdasarkan score tertinggi
    cy.get('[data-testid="leaderboard-item"]').eq(0).should('contain', 'Test User');
    cy.get('[data-testid="leaderboard-item"]').eq(0).should('contain', '100');
    
    cy.get('[data-testid="leaderboard-item"]').eq(1).should('contain', 'Another User');
    cy.get('[data-testid="leaderboard-item"]').eq(1).should('contain', '85');
    
    cy.get('[data-testid="leaderboard-item"]').eq(2).should('contain', 'Third User');
    cy.get('[data-testid="leaderboard-item"]').eq(2).should('contain', '70');
  });

  it('should display empty state when no leaderboard data', () => {
    // Intercept API call untuk mendapatkan data leaderboard kosong
    cy.intercept('GET', '**/v1/leaderboards', {
      statusCode: 200,
      body: [],
    }).as('getEmptyLeaderboard');

    // Refresh halaman untuk mendapatkan data kosong
    cy.reload();
    cy.wait('@getEmptyLeaderboard');

    // Memverifikasi pesan empty state ditampilkan
    cy.get('[data-testid="leaderboard-empty"]').should('exist');
    cy.get('[data-testid="leaderboard-empty"]').should('contain', 'Belum ada data leaderboard');
  });

  it('should display error message when leaderboard fails to load', () => {
    // Intercept API call untuk mendapatkan data leaderboard dengan error
    cy.intercept('GET', '**/v1/leaderboards', {
      statusCode: 500,
      body: {
        message: 'Internal server error'
      },
    }).as('getLeaderboardError');

    // Refresh halaman untuk mendapatkan error
    cy.reload();
    cy.wait('@getLeaderboardError');

    // Memverifikasi pesan error ditampilkan
    cy.get('[data-testid="leaderboard-error"]').should('exist');
    cy.get('[data-testid="leaderboard-error"]').should('contain', 'Gagal memuat data leaderboard');
  });

  it('should navigate to user profile when username is clicked', () => {
    // Intercept API call untuk mendapatkan detail user
    cy.intercept('GET', '**/users/user-2', {
      statusCode: 200,
      body: {
        id: 'user-2',
        name: 'Another User',
        email: 'another@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Another+User',
      },
    }).as('getUserDetail');

    // Klik username pada item leaderboard kedua
    cy.get('[data-testid="leaderboard-item"]').eq(1).find('[data-testid="user-name"]').click();

    // Memverifikasi redirect ke halaman profil user
    cy.url().should('include', '/users/user-2');

    // Menunggu detail user dimuat
    cy.wait('@getUserDetail');

    // Memverifikasi detail user ditampilkan
    cy.get('[data-testid="user-profile"]').should('exist');
    cy.get('[data-testid="user-profile"]').should('contain', 'Another User');
  });
});