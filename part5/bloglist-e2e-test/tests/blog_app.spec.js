const { test, expect, beforeEach, describe } = require("@playwright/test");

const blogs = [
  { title: 'Test Blog', author: 'Test Author', url: 'http://example.com' },
  { title: 'Another Blog', author: 'Another Author', url: 'http://example2.com' },
];

describe("Blog app", () => {
  const apiUrl = "http://localhost:3003/api";

  beforeEach(async ({ page, request }) => {
    await request.post(`${apiUrl}/testing/reset`);
    await request.post(`${apiUrl}/users`, {
      data: {
        username: "testuser",
        password: "password123",
        name: "Test User",
      },
    });
    await request.post(`${apiUrl}/users`, {
      data: {
        username: 'otheruser',
        password: 'password456',
        name: 'Other User',
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const usernameInput = page.locator('input[name="Username"]');
    await expect(usernameInput).toBeVisible();

    const passwordInput = page.locator('input[name="Password"]');
    await expect(passwordInput).toBeVisible();

    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.fill('input[name="Username"]', "testuser");
      await page.fill('input[name="Password"]', "password123");
      await page.click('button[type="submit"]');

      await expect(page.locator("text=Welcome, Test User!")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.fill('input[name="Username"]', "testuser");
      await page.fill('input[name="Password"]', "wrongpassword");
      await page.click('button[type="submit"]');

      const errorMessage = page.locator("text=Wrong username or password");
      await expect(errorMessage).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Log in the user
      await page.fill('input[name="Username"]', 'testuser');
      await page.fill('input[name="Password"]', 'password123');
      await page.click('button[type="submit"]');
  
      // Create new blogs
      for (const blog of blogs) {
        await page.getByRole('button', { name: 'new note' }).click();
        await page.fill('#title', blog.title);
        await page.fill('#author', blog.author);
        await page.fill('#url', blog.url);
        await page.click('button[type="submit"]');
      }
    });
  
    test('a new blog can be created', async ({ page }) => {
      // Verify the blog is visible in the list
      const blog = page.locator('.blog', { hasText: 'Test Blog Test Author' });
      await expect(blog).toBeVisible();
  
      // Verify the blog details
      await blog.locator('button', { hasText: 'view' }).click();
      await expect(page.locator('.details', { hasText: 'http://example.com' })).toBeVisible();
    });
  
    test('a blog can be liked', async ({ page }) => {
      const blog = page.locator('.blog', { hasText: 'Test Blog Test Author' });
      
      // Open the blog details
      await blog.locator('button', { hasText: 'view' }).click();
      const details = page.locator('.details');
  
      // Get initial likes and click "like" button
      const initialLikes = parseInt(await details.locator('p', { hasText: 'likes' }).textContent().then(text => text.match(/likes (\d+)/)[1]));
      await details.locator('button', { hasText: 'like' }).click();
      
      // Wait and verify likes increased
      await page.waitForTimeout(50);
      const updatedLikes = parseInt(await details.locator('p', { hasText: 'likes' }).textContent().then(text => text.match(/likes (\d+)/)[1]));
      expect(updatedLikes).toBe(initialLikes + 1);
    });

    test('the user who added the blog can delete it', async ({ page }) => {
      const blog = page.locator('.blog', { hasText: 'Test Blog Test Author' });
    
      // Open blog details
      await blog.locator('button', { hasText: 'view' }).click();
      const details = page.locator('.details');
    
      // Verify delete button is visible
      const deleteButton = details.locator('button', { hasText: 'remove' });
      await expect(deleteButton).toBeVisible();
    
      // Mock window.confirm to automatically confirm deletion
      await page.evaluate(() => {
        window.confirm = (message) => {
          console.log(message); // You can assert the message here if needed
          return true; // Confirm deletion
        };
      });
    
      // Click the remove button
      await deleteButton.click();
    
      // Verify the blog is no longer in the list
      await expect(blog).not.toBeVisible();
    });
    
    test('only the blog creator can see the delete button', async ({ page }) => {
      // Log out the first user and log in as another user
      await page.click('button', { hasText: 'logout' });
      await page.fill('input[name="Username"]', 'otheruser');
      await page.fill('input[name="Password"]', 'password456');
      await page.click('button[type="submit"]');
    
      const blog = page.locator('.blog', { hasText: 'Test Blog Test Author' });
    
      // Open blog details
      await blog.locator('button', { hasText: 'view' }).click();
      const details = page.locator('.details');
    
      // Verify remove button is not visible
      const deleteButton = details.locator('button', { hasText: 'remove' });
      await expect(deleteButton).not.toBeVisible();
    });
    
    test('blogs are arranged by likes, most liked first', async ({ page }) => {
      // Like the first blog once
      const testBlog = page.locator('.blog', { hasText: 'Test Blog Test Author' });
      await testBlog.locator('button', { hasText: 'view' }).click();
      const testDetails = page.locator('.details');
      await testDetails.locator('button', { hasText: 'like' }).click();
      await testBlog.locator('button', { hasText: 'hide' }).click();

      // Like the second blog twice
      const anotherBlog = page.locator('.blog', { hasText: 'Another Blog Another Author' });
      await anotherBlog.locator('button', { hasText: 'view' }).click();
      const anotherDetails = page.locator('.details');
      await anotherDetails.locator('button', { hasText: 'like' }).click();
      await anotherDetails.locator('button', { hasText: 'like' }).click();
      await anotherBlog.locator('button', { hasText: 'hide' }).click();
  
      // Verify order of blogs
      const blogs = await page.locator('.blog').allTextContents();
      const blogTitles = blogs.map(blog => blog.split(' ')[0]); // Extract titles
      expect(blogTitles).toEqual(['Another', 'Test']); // Most liked first
    });
  });
  
});
