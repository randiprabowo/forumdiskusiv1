// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Command untuk login
Cypress.Commands.add('login', (userType = 'validUser') => {
  cy.fixture('users.json').then((users) => {
    const user = users[userType];
    cy.visit('/login');
    
    // Intercept API call untuk login
    cy.intercept('POST', '**/v1/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      },
    }).as('loginUser');

    // Mengisi form login
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button[type="submit"]').click();

    // Menunggu API call selesai
    cy.wait('@loginUser');

    // Memverifikasi redirect ke halaman threads
    cy.url().should('include', '/');
  });
});

// Command untuk logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click();
  
  // Memverifikasi redirect ke halaman login
  cy.url().should('include', '/login');
});

// Command untuk membuat thread baru
Cypress.Commands.add('createThread', (threadType = 'newThread') => {
  cy.fixture('threads.json').then((threads) => {
    const thread = threads[threadType];
    cy.visit('/threads/new');
    
    // Intercept API call untuk membuat thread baru
    cy.intercept('POST', '**/v1/threads', {
      statusCode: 201,
      body: {
        id: 'thread-new',
        title: thread.title,
        body: thread.body,
        category: thread.category,
        createdAt: new Date().toISOString(),
        ownerId: 'user-1',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
        user: {
          id: 'user-1',
          name: 'Test User',
          email: 'testuser@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Test+User',
        },
      },
    }).as('createThread');

    // Mengisi form create thread
    cy.get('input[name="title"]').should('exist').type(thread.title, { delay: 0 });
    cy.get('textarea[name="body"]').should('exist').type(thread.body, { delay: 0 });
    cy.get('input[name="category"]').should('exist').type(thread.category, { delay: 0 });
    cy.get('button[type="submit"]').click();

    // Menunggu API call selesai
    cy.wait('@createThread');

    // Memverifikasi redirect ke halaman threads
    cy.url().should('include', '/');
  });
});

// Command untuk setup localStorage dengan user yang sudah login
Cypress.Commands.add('setupLoggedInUser', (userType = 'validUser') => {
  cy.fixture('users.json').then((users) => {
    const user = users[userType];
    cy.window().then((window) => {
      // Set both new and old keys for compatibility
      window.localStorage.setItem('diskusi_forum_token', 'fake-jwt-token');
      window.localStorage.setItem('token', 'fake-jwt-token');
      window.localStorage.setItem('diskusi_forum_user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }));
      window.localStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }));
    });
  });
});

// Command untuk setup intercept threads
Cypress.Commands.add('interceptThreads', () => {
  cy.fixture('threads.json').then(() => {
    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/threads', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'success',
        data: {
          threads: [
            {
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
            },
            {
              id: 'thread-2',
              title: 'Thread Title 2',
              body: 'Second thread body content',
              category: 'javascript',
              createdAt: '2023-05-30T11:00:00.000Z',
              owner: {
                id: 'user-1',
                name: 'Test User',
                avatar: 'https://ui-avatars.com/api/?name=Test+User'
              },
              upVotesBy: [],
              downVotesBy: [],
              totalComments: 0
            }
          ]
        }
      }
    }).as('getThreads');
  });
});

// Command untuk setup intercept thread detail
Cypress.Commands.add('interceptThreadDetail', () => {
  // Intercept initial GET request with correct pattern and data structure
  cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/threads/thread-1', {
    statusCode: 200,
    body: {
      status: 'success',
      message: 'success',
      data: {
        detailThread: {
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
          downVotesBy: [],
          comments: [
            {
              id: 'comment-1',
              content: 'Komentar pertama',
              createdAt: '2023-05-30T10:00:00.000Z',
              owner: {
                id: 'user-2',
                name: 'User 2',
                avatar: 'https://ui-avatars.com/api/?name=User+2'
              },
              upVotesBy: [],
              downVotesBy: []
            },
            {
              id: 'comment-2',
              content: 'Komentar kedua',
              createdAt: '2023-05-30T10:00:00.000Z',
              owner: {
                id: 'user-3',
                name: 'User 3',
                avatar: 'https://ui-avatars.com/api/?name=User+3'
              },
              upVotesBy: [],
              downVotesBy: []
            }
          ]
        }
      }
    }
  }).as('getThreadDetail');
});

// Command untuk setup intercept leaderboards
Cypress.Commands.add('interceptLeaderboards', () => {
  cy.fixture('leaderboards.json').then((leaderboardData) => {
    cy.intercept('GET', '**/v1/leaderboards', {
      statusCode: 200,
      body: leaderboardData.leaderboards,
    }).as('getLeaderboards');
  });
});

// Command untuk menunggu aplikasi siap dengan timeout lebih lama untuk CI
Cypress.Commands.add('waitForAppReady', () => {
  // Wait for the app to be fully loaded
  cy.window().should('have.property', 'React');
  
  // Wait for any initial API calls to complete
  cy.wait(2000);
  
  // Ensure no loading states are active
  cy.get('[data-testid="loading"]', { timeout: 20000 }).should('not.exist');
});

// Command untuk menunggu loading selesai dengan timeout lebih lama untuk CI
Cypress.Commands.add('waitForLoading', () => {
  // Wait for loading to disappear with longer timeout for CI
  cy.get('[data-testid="loading"]', { timeout: 20000 }).should('not.exist');
  
  // Additional wait to ensure page is fully loaded
  cy.wait(1000);
});

// Command untuk memverifikasi elemen yang visible
Cypress.Commands.add('shouldBeVisible', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).should('be.visible');
});

// Command untuk retry action jika gagal
Cypress.Commands.add('retryAction', (action, options = {}) => {
  const { maxAttempts = 3, delay = 1000 } = options;
  let attempts = 0;

  const attempt = () => {
    attempts++;
    try {
      action();
    } catch (error) {
      if (attempts < maxAttempts) {
        cy.wait(delay);
        attempt();
      } else {
        throw error;
      }
    }
  };

  attempt();
});