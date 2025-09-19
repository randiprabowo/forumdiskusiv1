// Skenario pengujian: Pengguna dapat melihat detail thread dan berinteraksi dengan komentar

describe('Thread Detail Flow', () => {
  beforeEach(() => {
    // Setup localStorage dengan token dan user data untuk simulasi user yang sudah login
    cy.setupLoggedInUser();
    
    // Setup intercept untuk thread detail sebelum visit
    cy.interceptThreadDetail();
    
    // Kunjungi halaman detail thread dengan retry jika gagal
    cy.visit('/threads/thread-1', { timeout: 10000 });
    
    // Tunggu thread detail dan pastikan loading selesai
    cy.wait('@getThreadDetail');
    cy.waitForLoading();
  });

  it('should display thread detail and comments', () => {
    // Memverifikasi thread container ada dan visible
    cy.get('[data-testid="thread-detail"]')
      .should('exist')
      .and('be.visible');

    // Memverifikasi detail thread ditampilkan dengan retry
    cy.get('[data-testid="thread-title"]')
      .should('be.visible')
      .and('contain', 'Thread Title 1');
    
    cy.get('[data-testid="thread-body"]')
      .should('be.visible')
      .and('contain', 'Thread body with detailed content');
    
    cy.get('[data-testid="thread-category"]')
      .should('be.visible')
      .and('contain', 'react');
    
    // Memverifikasi komentar ditampilkan dengan retry
    cy.get('[data-testid="comment-item"]', { timeout: 10000 })
      .should('have.length', 2)
      .should('be.visible');

    // Verifikasi konten komentar
    cy.get('[data-testid="comment-item"]').eq(0)
      .should('be.visible')
      .and('contain', 'Komentar pertama');
    
    cy.get('[data-testid="comment-item"]').eq(1)
      .should('be.visible')
      .and('contain', 'Komentar kedua');
  });

  it('should upvote thread when upvote button is clicked', () => {
    // Setup intercept for initial thread detail load
    cy.interceptThreadDetail();
    
    // Wait for thread detail to load and verify initial state
    cy.wait('@getThreadDetail');
    cy.get('[data-testid="thread-title"]').should('be.visible');
    cy.get('[data-testid="upvote-button"]').should('be.visible');
    cy.get('[data-testid="upvote-count"]').should('be.visible').and('contain', '0');
    
    // Intercept API call untuk upvote thread
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/threads/thread-1/up-vote', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'success',
        data: {
          vote: {
            id: 'vote-1',
            userId: 'user-1',
            threadId: 'thread-1',
            voteType: 1
          }
        }
      }
    }).as('upvoteThread');

    // Update thread detail response after vote
    cy.intercept('GET', '**/v1/threads/thread-1', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'success',
        data: {
          thread: {
            id: 'thread-1',
            title: 'Thread Title 1',
            body: 'Thread body with detailed content',
            category: 'react',
            createdAt: '2023-05-30T10:00:00.000Z',
            owner: {
              id: 'user-1',
              name: 'Test User',
              avatar: 'https://ui-avatars.com/api/?name=Test+User'
            },
            upVotesBy: ['user-1'],
            downVotesBy: [],
            comments: []
          }
        }
      }
    }).as('getThreadDetailAfterVote');

    // Klik tombol upvote dengan retry
    cy.get('[data-testid="upvote-button"]')
      .should('be.visible')
      .click();

    // Memverifikasi API call untuk upvote thread
    cy.wait('@upvoteThread');

    // Memverifikasi UI diperbarui dengan retry dan timeout yang lebih lama
    cy.get('[data-testid="upvote-count"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', '1');
    cy.get('[data-testid="upvote-button"]', { timeout: 10000 })
      .should('have.class', 'voted');
  });

  it('should downvote thread when downvote button is clicked', () => {
    // Wait for thread detail to load and verify initial state
    cy.wait('@getThreadDetail');
    cy.get('[data-testid="downvote-button"]').should('be.visible');
    cy.get('[data-testid="downvote-count"]').should('be.visible').and('contain', '0');
    
    // Intercept API call untuk downvote thread
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/threads/thread-1/down-vote', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'success',
        data: {
          vote: {
            id: 'vote-1',
            userId: 'user-1',
            threadId: 'thread-1',
            voteType: -1
          }
        }
      }
    }).as('downvoteThread');

    // Update thread detail response after vote
    cy.intercept('GET', '**/v1/threads/thread-1', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'success',
        data: {
          thread: {
            id: 'thread-1',
            title: 'Thread Title 1',
            body: 'Thread body with detailed content',
            category: 'react',
            createdAt: '2023-05-30T10:00:00.000Z',
            owner: {
              id: 'user-1',
              name: 'Test User',
              avatar: 'https://ui-avatars.com/api/?name=Test+User'
            },
            upVotesBy: [],
            downVotesBy: ['user-1'],
            comments: []
          }
        }
      }
    }).as('getThreadDetailAfterVote');

    // Klik tombol downvote dengan retry
    cy.get('[data-testid="downvote-button"]')
      .should('be.visible')
      .click();

    // Memverifikasi API call untuk downvote thread
    cy.wait('@downvoteThread');

    // Memverifikasi UI diperbarui dengan retry dan timeout yang lebih lama
    cy.get('[data-testid="downvote-count"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', '1');
    cy.get('[data-testid="downvote-button"]', { timeout: 10000 })
      .should('have.class', 'voted');
  });

  it('should add comment when comment form is submitted', () => {
    // Setup initial state verification
    cy.get('[data-testid="comment-item"]').should('have.length', 2);
    
    // Intercept API call untuk menambahkan komentar
    cy.intercept('POST', '**/v1/threads/thread-1/comments', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'success',
        data: {
          comment: {
            id: 'comment-3',
            content: 'Komentar baru',
            createdAt: '2023-05-30T10:00:00.000Z',
            owner: {
              id: 'user-1',
              name: 'Test User',
              avatar: 'https://ui-avatars.com/api/?name=Test+User',
            },
            upVotesBy: [],
            downVotesBy: []
          }
        }
      },
    }).as('addComment');

    // Setup thread detail refresh after comment
    cy.interceptThreadDetail();

    // Verifikasi form komentar visible dan interactable
    cy.get('[data-testid="comment-input"]')
      .should('be.visible')
      .clear()
      .type('Komentar baru', { delay: 0 });

    cy.get('[data-testid="comment-submit"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // Memverifikasi API calls
    cy.wait('@addComment');
    cy.wait('@getThreadDetail');

    // Memverifikasi komentar baru ditampilkan dengan retry dan timeout
    cy.get('[data-testid="comment-item"]', { timeout: 10000 })
      .should('have.length', 3)
      .last()
      .should('be.visible')
      .and('contain', 'Komentar baru');
  });

  it('should upvote comment when comment upvote button is clicked', () => {
    // Intercept API call untuk upvote komentar
    cy.intercept('POST', '**/v1/threads/thread-1/comments/comment-1/up-vote', {
      statusCode: 200,
      body: {
        message: 'Comment upvoted successfully'
      },
    }).as('upvoteComment');

    // Klik tombol upvote pada komentar pertama
    cy.get('[data-testid="comment-item"]').eq(0).find('[data-testid="comment-upvote-button"]').click();

    // Memverifikasi API call untuk upvote komentar
    cy.wait('@upvoteComment');

    // Memverifikasi UI diperbarui
    cy.get('[data-testid="comment-item"]').eq(0).find('[data-testid="comment-upvote-count"]').should('contain', '1');
    cy.get('[data-testid="comment-item"]').eq(0).find('[data-testid="comment-upvote-button"]').should('have.class', 'voted');
  });
});