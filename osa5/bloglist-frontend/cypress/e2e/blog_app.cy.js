describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')

    const user = {
      name: 'User For-test',
      username: 'TestUser',
      password: 'passu'
    }
    const user2 = {
      name: 'Test Usertwo',
      username: 'Numbatwo',
      password: 'passw'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
  })
  it('Login form is shown', function() {
    cy.visit('http://localhost:3000/')
    cy.get('#loginusername')
    cy.get('#loginpassword')
    cy.get('#loginbutton')
  })
  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#loginusername').type('TestUser')
      cy.get('#loginpassword').type('passu')
      cy.get('#loginbutton').click()

      cy.contains('User For-test logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#loginusername').type('TestUser')
      cy.get('#loginpassword').type('falsepass')
      cy.get('#loginbutton').click()

      cy.get('.failure').contains('Wrong username or password')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'TestUser', password: 'passu' })
    })
    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#blogtitle').type('Uninspiring blog')
      cy.get('#blogauthor').type('User For-Test')
      cy.get('#blogurl').type('www.uninspiring-site.com')
      cy.get('#submitbutton').click()
      cy.contains('new blog')
    })
    describe('When blog added', function() {
      beforeEach(function() {
        cy.contains('new blog').click()
        cy.get('#blogtitle').type('Uninspiring blog')
        cy.get('#blogauthor').type('User For-Test')
        cy.get('#blogurl').type('www.uninspiring-site.com')
        cy.get('#submitbutton').click()
      })
      it('Blog can be liked', function() {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })
      it('Blog can be deleted', function() {
        cy.contains('view').click()
        cy.contains('Uninspiring blog')
        cy.contains('remove').click()
        cy.contains('likes').should('not.exist')
      })
    })
  })
  describe('When blogs by two other people exist', function() {
    beforeEach(function() {
      cy.login({ username: 'TestUser', password: 'passu' })
      cy.createBlog({ title: 'Interesting blog', author: 'No Creativity', url: 'www.random.com', likes: 10 })
      cy.createBlog({ title: 'Whatever It is', author: 'Someone Unknown', url: 'www.dunno.com', likes: 15 })
      cy.login({ username: 'Numbatwo', password: 'passw' })
      cy.createBlog({ title: 'Harry Potter', author: 'J.K Rowling', url: 'www.harrypotter.com', likes: 100 })
    })
    it('Blog published by other can not be removed', function() {
      cy.contains('Interesting blog No Creativity').contains('view').click()
      cy.contains('remove').should('not.be.visible')
    })
  })
})