// Skenario pengujian: Pengguna dapat melihat detail thread dan berinteraksi dengan komentar

describe('Thread Detail Flow', () => {
  beforeEach(() => {
    // Setup localStorage dengan token dan user data untuk simulasi user yang sudah login
    cy.setupLoggedInUser();
    
    // Setup intercept untuk thread detail
    cy.interceptThreadDetail();
    
    // Kunjungi halaman detail thread
    cy.visit('/threads/thread-1');
    cy.wait('@getThreadDetail');
  });

  it('should display thread detail and comments', () => {
    // Memverifikasi detail thread ditampilkan
    cy.get('[data-testid="thread-title"]').should('contain', 'Thread Title 1');
    cy.get('[data-testid="thread-body"]').should('contain', 'Thread body with detailed content');
    cy.get('[data-testid="thread-category"]').should('contain', 'react');
    
    // Memverifikasi komentar ditampilkan
    cy.get('[data-testid="comment-item"]').should('have.length', 2);
    cy.get('[data-testid="comment-item"]').eq(0).should('contain', 'Komentar pertama');
    cy.get('[data-testid="comment-item"]').eq(1).should('contain', 'Komentar kedua');
  });

  it('should upvote thread when upvote button is clicked', () => {
    // Wait for thread detail to load and verify initial state
    cy.wait('@getThreadDetail');
    cy.get('[data-testid="upvote-button"]').should('be.visible');
    cy.get('[data-testid="upvote-count"]').should('be.visible').and('contain', '0');
    
    // Intercept API call untuk upvote thread
    cy.intercept('POST', '**/v1/threads/thread-1/up-vote', {
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

    // Klik tombol upvote
    cy.get('[data-testid="upvote-button"]').click();

    // Memverifikasi API call untuk upvote thread
    cy.wait('@upvoteThread');

    // Memverifikasi UI diperbarui
    cy.get('[data-testid="upvote-count"]').should('be.visible').and('contain', '1');
    cy.get('[data-testid="upvote-button"]').should('have.class', 'voted');
  });

  it('should downvote thread when downvote button is clicked', () => {
    // Wait for thread detail to load and verify initial state
    cy.wait('@getThreadDetail');
    cy.get('[data-testid="downvote-button"]').should('be.visible');
    cy.get('[data-testid="downvote-count"]').should('be.visible').and('contain', '0');
    
    // Intercept API call untuk downvote thread
    cy.intercept('POST', '**/v1/threads/thread-1/down-vote', {
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

    // Klik tombol downvote
    cy.get('[data-testid="downvote-button"]').click();

    // Memverifikasi API call untuk downvote thread
    cy.wait('@downvoteThread');

    // Memverifikasi UI diperbarui
    cy.get('[data-testid="downvote-count"]').should('be.visible').and('contain', '1');
    cy.get('[data-testid="downvote-button"]').should('have.class', 'voted');
  });

  it('should add comment when comment form is submitted', () => {
    // Intercept API call untuk menambahkan komentar
    cy.intercept('POST', '**/v1/threads/thread-1/comments', {
      statusCode: 200,
      body: {
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
      },
    }).as('addComment');

    // Isi form komentar
    cy.get('[data-testid="comment-input"]').type('Komentar baru');
    cy.get('[data-testid="comment-submit"]').click();

    // Memverifikasi API call untuk menambahkan komentar
    cy.wait('@addComment');

    // Memverifikasi komentar baru ditampilkan
    cy.get('[data-testid="comment-item"]').should('have.length', 3);
    cy.get('[data-testid="comment-item"]').eq(2).should('contain', 'Komentar baru');
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