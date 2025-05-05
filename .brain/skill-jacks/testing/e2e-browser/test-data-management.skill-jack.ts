/**
 * Skill-Jack: Test Data Management
 * 
 * A comprehensive guide to managing test data in E2E tests.
 * 
 * @module brain-garden/skill-jack
 * @category testing/patterns
 */

/**
 * Skill-Jack on Test Data Management
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * effective test data management practices in E2E tests.
 */
export const topicGuide = {
  topic: "Test Data Management",
  description: "A structured approach to creating, managing, and cleaning up test data in E2E tests to ensure test reliability, isolation, and maintainability.",
  corePrinciples: [
    {
      name: "Data Isolation",
      description: "Each test should have its own isolated data that doesn't interfere with other tests, ensuring tests can run independently and in any order.",
      examples: [
        "Using unique identifiers for all test data",
        "Creating fresh test data for each test rather than sharing",
        "Implementing proper cleanup to prevent data leakage between tests"
      ]
    },
    {
      name: "Realistic Data Models",
      description: "Test data should realistically represent production data in structure and relationships, ensuring tests validate real-world scenarios.",
      examples: [
        "Modeling data with appropriate relationships between entities",
        "Using realistic data values that match production patterns",
        "Incorporating edge cases that occur in production systems"
      ]
    },
    {
      name: "Deterministic Data Generation",
      description: "Test data should be generated deterministically, ensuring tests produce consistent results across different runs and environments.",
      examples: [
        "Using seeded random generators for controlled variation",
        "Creating data factories with explicit parameters",
        "Avoiding dependencies on current date/time unless explicitly testing time-dependent features"
      ]
    },
    {
      name: "Minimal Data Sets",
      description: "Tests should use the minimum data necessary to validate functionality, improving test clarity and performance.",
      examples: [
        "Creating only the specific entities needed for each test",
        "Avoiding loading large datasets when testing specific features",
        "Testing with the minimal state required to reproduce a scenario"
      ]
    },
    {
      name: "Data Setup Abstraction",
      description: "Data setup and cleanup should be abstracted into reusable utilities, ensuring consistency and reducing duplication across tests.",
      examples: [
        "Creating data factory functions for common entities",
        "Using builder patterns for flexible entity creation",
        "Implementing fixture utilities for common data scenarios"
      ]
    },
    {
      name: "Environment Adaptability",
      description: "Test data management should adapt to different environments (development, staging, CI) while maintaining test consistency.",
      examples: [
        "Using configuration to adjust data creation strategies per environment",
        "Implementing consistent cleanup regardless of environment",
        "Handling differences in data constraints between environments"
      ]
    }
  ],
  applicationProcess: {
    description: "A systematic approach to implementing effective test data management in E2E tests.",
    steps: [
      {
        name: "Analyze Data Requirements",
        description: "Identify what data is needed for tests and how it should be structured.",
        agentActions: [
          {
            action: "Identify entity types needed for tests",
            explanation: "Determine what kinds of entities (users, products, orders, etc.) tests will require."
          },
          {
            action: "Map entity relationships",
            explanation: "Define how entities relate to each other and what constraints apply."
          },
          {
            action: "Catalog required test scenarios",
            explanation: "Document the different data scenarios needed to cover various test cases."
          }
        ]
      },
      {
        name: "Design Data Generation Strategy",
        description: "Create a strategy for generating test data that supports all test needs.",
        agentActions: [
          {
            action: "Select data generation approach",
            explanation: "Decide between hardcoded data, random generation, or a hybrid approach."
          },
          {
            action: "Create identifier strategy",
            explanation: "Develop a system for creating unique identifiers that won't conflict between tests."
          },
          {
            action: "Plan for edge cases",
            explanation: "Ensure the generation strategy can produce edge cases needed for testing."
          }
        ]
      },
      {
        name: "Implement Data Factories",
        description: "Create reusable factories to generate test entities with consistent structure.",
        agentActions: [
          {
            action: "Create base entity factories",
            explanation: "Implement factory functions for each entity type with sensible defaults."
          },
          {
            action: "Add customization options",
            explanation: "Enable factories to accept overrides for specific properties when needed."
          },
          {
            action: "Implement relationship handling",
            explanation: "Add support for creating related entities automatically or accepting existing ones."
          }
        ]
      },
      {
        name: "Develop Data Setup and Cleanup",
        description: "Create utilities for setting up test data and cleaning it up after tests.",
        agentActions: [
          {
            action: "Implement data setup utilities",
            explanation: "Create functions to set up data for specific test scenarios."
          },
          {
            action: "Create cleanup mechanisms",
            explanation: "Develop reliable cleanup functions to remove test data after use."
          },
          {
            action: "Add tracking for created entities",
            explanation: "Implement tracking of created entities to ensure complete cleanup."
          }
        ]
      },
      {
        name: "Integrate with Test Framework",
        description: "Connect data management utilities with the test framework for smooth operation.",
        agentActions: [
          {
            action: "Add setup/teardown hooks",
            explanation: "Use test framework hooks to handle data setup and cleanup at appropriate times."
          },
          {
            action: "Implement test isolation",
            explanation: "Ensure tests use isolated data sets that don't interfere with each other."
          },
          {
            action: "Add error handling",
            explanation: "Implement robust error handling to ensure cleanup occurs even when tests fail."
          }
        ]
      },
      {
        name: "Optimize Data Management Performance",
        description: "Enhance the efficiency of data operations to keep tests fast.",
        agentActions: [
          {
            action: "Batch operations where possible",
            explanation: "Group database operations to reduce round-trips and improve performance."
          },
          {
            action: "Implement caching for static data",
            explanation: "Cache reference data or slow-to-generate entities when safe to do so."
          },
          {
            action: "Create optimized cleanup strategies",
            explanation: "Design efficient cleanup approaches that balance thoroughness with speed."
          }
        ]
      }
    ]
  },
  examples: {
    description: "Practical examples of test data management in different testing scenarios.",
    useCases: [
      {
        scenario: "E-commerce product catalog testing",
        implementation: "Creating a diverse set of product test data with various categories, prices, and availability states.",
        outcome: "Tests can validate catalog browsing, filtering, and sorting with realistic product data while maintaining isolation between test runs."
      },
      {
        scenario: "User authentication and authorization testing",
        implementation: "Generating users with different roles, permissions, and account states for authentication testing.",
        outcome: "Tests can verify access control rules and authentication workflows for different user types without interference between test cases."
      },
      {
        scenario: "Order processing workflow testing",
        implementation: "Creating order data at various stages of processing with appropriate related entities.",
        outcome: "Tests can validate complex order workflows from creation through fulfillment using realistic data that represents actual business processes."
      },
      {
        scenario: "Content management system testing",
        implementation: "Generating hierarchical content structures with various publication states and user permissions.",
        outcome: "Tests can verify content creation, editing, and publishing workflows with realistic content relationships and access controls."
      }
    ]
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Basic test data factories",
      code: `
import { v4 as uuidv4 } from 'uuid';

/**
 * User model interface
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

/**
 * Product model interface
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  createdAt: Date;
}

/**
 * Order model interface
 */
export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: Date;
}

/**
 * Factory for creating test users
 */
export const UserFactory = {
  build(overrides: Partial<User> = {}): User {
    const uniqueId = uuidv4().substring(0, 8);
    
    return {
      id: \`user_\${uniqueId}\`,
      email: \`test.\${uniqueId}@example.com\`,
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      createdAt: new Date(),
      ...overrides
    };
  },
  
  buildAdmin(overrides: Partial<User> = {}): User {
    return this.build({
      role: 'admin',
      ...overrides
    });
  },
  
  buildGuest(overrides: Partial<User> = {}): User {
    return this.build({
      role: 'guest',
      ...overrides
    });
  }
};

/**
 * Factory for creating test products
 */
export const ProductFactory = {
  build(overrides: Partial<Product> = {}): Product {
    const uniqueId = uuidv4().substring(0, 8);
    
    return {
      id: \`product_\${uniqueId}\`,
      name: \`Test Product \${uniqueId}\`,
      price: 19.99,
      description: 'This is a test product description',
      category: 'electronics',
      inStock: true,
      createdAt: new Date(),
      ...overrides
    };
  },
  
  buildOutOfStock(overrides: Partial<Product> = {}): Product {
    return this.build({
      inStock: false,
      ...overrides
    });
  },
  
  buildCollection(count: number, overrides: Partial<Product> = {}): Product[] {
    return Array.from({ length: count }, (_, index) => 
      this.build({
        name: \`Test Product \${index + 1}\`,
        price: 9.99 + index * 10,
        ...overrides
      })
    );
  }
};

/**
 * Factory for creating test orders
 */
export const OrderFactory = {
  build(user?: User, products?: Product[], overrides: Partial<Order> = {}): Order {
    const uniqueId = uuidv4().substring(0, 8);
    const userId = user?.id || \`user_\${uniqueId}\`;
    const orderProducts = products || [ProductFactory.build(), ProductFactory.build()];
    
    const items = orderProducts.map(product => ({
      productId: product.id,
      quantity: 1,
      unitPrice: product.price
    }));
    
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice, 
      0
    );
    
    return {
      id: \`order_\${uniqueId}\`,
      userId,
      items,
      totalAmount,
      status: 'pending',
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip: '12345',
        country: 'Test Country'
      },
      createdAt: new Date(),
      ...overrides
    };
  },
  
  buildWithStatus(status: Order['status'], overrides: Partial<Order> = {}): Order {
    return this.build(undefined, undefined, {
      status,
      ...overrides
    });
  }
};
`,
      explanation: "This example shows basic factory functions for creating test data. Each factory has a main build method with sensible defaults and additional utility methods for common variations. The factories use UUID generation to ensure each entity has a unique identifier, and they accept override parameters to customize specific properties when needed."
    },
    {
      language: "typescript",
      description: "API-based test data management",
      code: `
import { UserFactory, ProductFactory, OrderFactory } from './factories';
import { ApiClient } from '../utils/api-client';
import { User, Product, Order } from './models';

/**
 * Test data management using API calls
 */
export class TestDataManager {
  private apiClient: ApiClient;
  private createdUsers: User[] = [];
  private createdProducts: Product[] = [];
  private createdOrders: Order[] = [];
  
  constructor(apiBaseUrl: string, apiKey?: string) {
    this.apiClient = new ApiClient(apiBaseUrl, apiKey);
  }
  
  /**
   * Create a test user via API
   */
  async createUser(overrides: Partial<User> = {}): Promise<User> {
    // Generate test user data
    const userData = UserFactory.build(overrides);
    
    // Create user via API
    const response = await this.apiClient.post('/api/users', userData);
    const user = response.data;
    
    // Track created user for cleanup
    this.createdUsers.push(user);
    
    return user;
  }
  
  /**
   * Create a test admin user via API
   */
  async createAdminUser(overrides: Partial<User> = {}): Promise<User> {
    return this.createUser({ role: 'admin', ...overrides });
  }
  
  /**
   * Create a test product via API
   */
  async createProduct(overrides: Partial<Product> = {}): Promise<Product> {
    // Generate test product data
    const productData = ProductFactory.build(overrides);
    
    // Create product via API
    const response = await this.apiClient.post('/api/products', productData);
    const product = response.data;
    
    // Track created product for cleanup
    this.createdProducts.push(product);
    
    return product;
  }
  
  /**
   * Create multiple test products via API
   */
  async createProducts(count: number, overrides: Partial<Product> = {}): Promise<Product[]> {
    const products: Product[] = [];
    
    // Create products sequentially to avoid overwhelming the API
    for (let i = 0; i < count; i++) {
      const product = await this.createProduct({
        name: \`Test Product \${i + 1}\`,
        ...overrides
      });
      products.push(product);
    }
    
    return products;
  }
  
  /**
   * Create a test order via API
   */
  async createOrder(user?: User, products?: Product[], overrides: Partial<Order> = {}): Promise<Order> {
    // If no user provided, create one
    const orderUser = user || await this.createUser();
    
    // If no products provided, create some
    const orderProducts = products || await this.createProducts(2);
    
    // Generate test order data
    const orderData = OrderFactory.build(orderUser, orderProducts, overrides);
    
    // Create order via API
    const response = await this.apiClient.post('/api/orders', orderData);
    const order = response.data;
    
    // Track created order for cleanup
    this.createdOrders.push(order);
    
    return order;
  }
  
  /**
   * Clean up all created test data
   */
  async cleanup(): Promise<void> {
    try {
      // Delete in reverse order of dependencies
      for (const order of this.createdOrders) {
        await this.apiClient.delete(\`/api/orders/\${order.id}\`);
      }
      
      for (const product of this.createdProducts) {
        await this.apiClient.delete(\`/api/products/\${product.id}\`);
      }
      
      for (const user of this.createdUsers) {
        await this.apiClient.delete(\`/api/users/\${user.id}\`);
      }
      
      // Clear tracking arrays
      this.createdOrders = [];
      this.createdProducts = [];
      this.createdUsers = [];
    } catch (error) {
      console.error('Error cleaning up test data:', error);
      throw error;
    }
  }
}

/**
 * Example usage in tests
 */
describe('Order Management', () => {
  let dataManager: TestDataManager;
  let testUser: User;
  let testProducts: Product[];
  
  beforeAll(async () => {
    // Initialize test data manager
    dataManager = new TestDataManager('https://api.example.com', process.env.API_KEY);
  });
  
  afterAll(async () => {
    // Clean up all test data
    await dataManager.cleanup();
  });
  
  beforeEach(async () => {
    // Create fresh test data for each test
    testUser = await dataManager.createUser();
    testProducts = await dataManager.createProducts(3);
  });
  
  test('User can place an order', async () => {
    // Arrange: Create test data for this specific test
    const order = await dataManager.createOrder(testUser, [testProducts[0], testProducts[1]]);
    
    // Act & Assert: Test with the created data
    expect(order.userId).toBe(testUser.id);
    expect(order.items.length).toBe(2);
    expect(order.status).toBe('pending');
  });
});
`,
      explanation: "This example demonstrates a test data manager that creates and tracks test data via API calls. It uses the factory functions to generate test data and then creates entities through API endpoints. The manager keeps track of all created entities to ensure they're properly cleaned up after tests complete, even if a test fails."
    },
    {
      language: "typescript",
      description: "Database-driven test data management",
      code: `
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { UserFactory, ProductFactory, OrderFactory } from './factories';
import { User, Product, Order } from './models';

/**
 * Database-driven test data manager
 */
export class DbTestDataManager {
  private db: Pool;
  private createdUserIds: string[] = [];
  private createdProductIds: string[] = [];
  private createdOrderIds: string[] = [];
  
  constructor(connectionString: string) {
    this.db = new Pool({ connectionString });
  }
  
  /**
   * Create a test user directly in the database
   */
  async createUser(overrides: Partial<User> = {}): Promise<User> {
    // Generate test user data
    const userData = UserFactory.build(overrides);
    
    // Insert into database
    const query = \`
      INSERT INTO users (id, email, first_name, last_name, role, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    \`;
    
    const values = [
      userData.id,
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.role,
      userData.createdAt
    ];
    
    const result = await this.db.query(query, values);
    const user = this.mapDbUserToModel(result.rows[0]);
    
    // Track created user ID for cleanup
    this.createdUserIds.push(user.id);
    
    return user;
  }
  
  /**
   * Create a test product directly in the database
   */
  async createProduct(overrides: Partial<Product> = {}): Promise<Product> {
    // Generate test product data
    const productData = ProductFactory.build(overrides);
    
    // Insert into database
    const query = \`
      INSERT INTO products (id, name, price, description, category, in_stock, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    \`;
    
    const values = [
      productData.id,
      productData.name,
      productData.price,
      productData.description,
      productData.category,
      productData.inStock,
      productData.createdAt
    ];
    
    const result = await this.db.query(query, values);
    const product = this.mapDbProductToModel(result.rows[0]);
    
    // Track created product ID for cleanup
    this.createdProductIds.push(product.id);
    
    return product;
  }
  
  /**
   * Create multiple test products in a single batch
   */
  async createProducts(count: number, baseOverrides: Partial<Product> = {}): Promise<Product[]> {
    const products: Product[] = [];
    const values: any[] = [];
    const placeholders: string[] = [];
    
    // Generate data for all products
    for (let i = 0; i < count; i++) {
      const productData = ProductFactory.build({
        name: \`Test Product \${i + 1}\`,
        ...baseOverrides
      });
      
      products.push(productData);
      this.createdProductIds.push(productData.id);
      
      // Add to values array for batch insert
      const offset = i * 7;
      values.push(
        productData.id,
        productData.name,
        productData.price,
        productData.description,
        productData.category,
        productData.inStock,
        productData.createdAt
      );
      
      placeholders.push(\`($\${offset + 1}, $\${offset + 2}, $\${offset + 3}, $\${offset + 4}, $\${offset + 5}, $\${offset + 6}, $\${offset + 7})\`);
    }
    
    // Batch insert all products
    const query = \`
      INSERT INTO products (id, name, price, description, category, in_stock, created_at)
      VALUES \${placeholders.join(', ')}
      RETURNING *
    \`;
    
    const result = await this.db.query(query, values);
    
    // Map database results to model objects
    return result.rows.map(row => this.mapDbProductToModel(row));
  }
  
  /**
   * Create a test order with items
   */
  async createOrder(user?: User, products?: Product[], overrides: Partial<Order> = {}): Promise<Order> {
    // If no user provided, create one
    const orderUser = user || await this.createUser();
    
    // If no products provided, create some
    const orderProducts = products || await this.createProducts(2);
    
    // Generate test order data
    const orderData = OrderFactory.build(orderUser, orderProducts, overrides);
    
    // Start a transaction for related inserts
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      
      // Insert order
      const orderQuery = \`
        INSERT INTO orders (id, user_id, total_amount, status, created_at,
                          shipping_street, shipping_city, shipping_state, shipping_zip, shipping_country)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      \`;
      
      const orderValues = [
        orderData.id,
        orderData.userId,
        orderData.totalAmount,
        orderData.status,
        orderData.createdAt,
        orderData.shippingAddress.street,
        orderData.shippingAddress.city,
        orderData.shippingAddress.state,
        orderData.shippingAddress.zip,
        orderData.shippingAddress.country
      ];
      
      const orderResult = await client.query(orderQuery, orderValues);
      
      // Insert order items
      for (const item of orderData.items) {
        const itemQuery = \`
          INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          VALUES ($1, $2, $3, $4)
        \`;
        
        await client.query(itemQuery, [
          orderData.id,
          item.productId,
          item.quantity,
          item.unitPrice
        ]);
      }
      
      // Commit transaction
      await client.query('COMMIT');
      
      // Track created order ID for cleanup
      this.createdOrderIds.push(orderData.id);
      
      // Return the created order
      return {
        ...orderData,
        id: orderResult.rows[0].id
      };
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Release client back to pool
      client.release();
    }
  }
  
  /**
   * Clean up all created test data
   */
  async cleanup(): Promise<void> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      
      // Delete in reverse order of dependencies
      if (this.createdOrderIds.length > 0) {
        await client.query(\`
          DELETE FROM order_items WHERE order_id = ANY($1::text[])
        \`, [this.createdOrderIds]);
        
        await client.query(\`
          DELETE FROM orders WHERE id = ANY($1::text[])
        \`, [this.createdOrderIds]);
      }
      
      if (this.createdProductIds.length > 0) {
        await client.query(\`
          DELETE FROM products WHERE id = ANY($1::text[])
        \`, [this.createdProductIds]);
      }
      
      if (this.createdUserIds.length > 0) {
        await client.query(\`
          DELETE FROM users WHERE id = ANY($1::text[])
        \`, [this.createdUserIds]);
      }
      
      await client.query('COMMIT');
      
      // Clear tracking arrays
      this.createdOrderIds = [];
      this.createdProductIds = [];
      this.createdUserIds = [];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error cleaning up test data:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    await this.db.end();
  }
  
  /**
   * Map database row to User model
   */
  private mapDbUserToModel(row: any): User {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      role: row.role,
      createdAt: new Date(row.created_at)
    };
  }
  
  /**
   * Map database row to Product model
   */
  private mapDbProductToModel(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      price: row.price,
      description: row.description,
      category: row.category,
      inStock: row.in_stock,
      createdAt: new Date(row.created_at)
    };
  }
}

/**
 * Example usage with database transaction isolation
 */
describe('Order Management', () => {
  let dataManager: DbTestDataManager;
  
  beforeAll(async () => {
    // Initialize database test data manager
    dataManager = new DbTestDataManager(process.env.TEST_DATABASE_URL || '');
  });
  
  afterAll(async () => {
    // Clean up and close connection
    await dataManager.cleanup();
    await dataManager.close();
  });
  
  test('Complete order processing flow', async () => {
    // Create test user and products directly in the database
    const user = await dataManager.createUser();
    const products = await dataManager.createProducts(2);
    
    // Create an order for testing
    const order = await dataManager.createOrder(user, products, {
      status: 'pending'
    });
    
    // Now test with the created data
    expect(order.userId).toBe(user.id);
    expect(order.items.length).toBe(2);
    
    // Test code would continue here...
  });
});
`,
      explanation: "This example shows a database-driven test data manager that creates test data by directly inserting into a database. It uses transactions to ensure data consistency and implements batch operations for efficiency. The manager tracks all created entities and provides comprehensive cleanup to maintain test isolation."
    },
    {
      language: "typescript",
      description: "Playwright fixtures for test data",
      code: `
import { test as base, expect } from '@playwright/test';
import { TestDataManager } from './test-data-manager';
import { User, Product, Order } from './models';

/**
 * Enhanced test fixtures for data management
 */
type TestDataFixtures = {
  dataManager: TestDataManager;
  testUser: User;
  adminUser: User;
  testProducts: Product[];
  testOrder: Order;
};

// Extend the base test with data fixtures
export const test = base.extend<TestDataFixtures>({
  // Create and provide a test data manager
  dataManager: async ({}, use) => {
    const dataManager = new TestDataManager(
      process.env.API_URL || 'http://localhost:3000/api',
      process.env.API_KEY
    );
    
    await use(dataManager);
    
    // Clean up all test data after use
    await dataManager.cleanup();
  },
  
  // Create and provide a standard test user
  testUser: async ({ dataManager }, use) => {
    const user = await dataManager.createUser();
    await use(user);
    // No cleanup needed here as the dataManager fixture will handle it
  },
  
  // Create and provide an admin user
  adminUser: async ({ dataManager }, use) => {
    const admin = await dataManager.createUser({ role: 'admin' });
    await use(admin);
  },
  
  // Create and provide a collection of test products
  testProducts: async ({ dataManager }, use) => {
    const products = await dataManager.createProducts(3);
    await use(products);
  },
  
  // Create and provide a test order (depends on user and products)
  testOrder: async ({ dataManager, testUser, testProducts }, use) => {
    const order = await dataManager.createOrder(testUser, testProducts.slice(0, 2));
    await use(order);
  }
});

// Re-export expect for convenience
export { expect };

/**
 * Example usage in tests
 */
// In a test file:
import { test, expect } from './test-fixtures';

test.describe('Order management', () => {
  test('Admin can view all orders', async ({ page, adminUser, testOrder }) => {
    // Log in as admin
    await page.goto('/login');
    await page.fill('[data-testid="email"]', adminUser.email);
    await page.fill('[data-testid="password"]', 'password123'); // Assuming a fixed password for test users
    await page.click('[data-testid="login-button"]');
    
    // Navigate to orders page
    await page.click('text=Orders');
    
    // Verify the test order is visible
    await expect(page.locator(\`[data-testid="order-\${testOrder.id}"]\`)).toBeVisible();
  });
  
  test('User can only view their own orders', async ({ page, testUser, testOrder }) => {
    // Log in as regular user
    await page.goto('/login');
    await page.fill('[data-testid="email"]', testUser.email);
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to orders page
    await page.click('text=My Orders');
    
    // Verify the user's order is visible
    await expect(page.locator(\`[data-testid="order-\${testOrder.id}"]\`)).toBeVisible();
  });
});
`,
      explanation: "This example demonstrates using Playwright test fixtures for test data management. It creates fixtures that provide different types of test data (users, products, orders) to tests that need them. The fixtures handle dependencies between data types and ensure proper cleanup after tests complete. This approach makes tests more declarative and focuses them on behavior rather than data setup."
    }
  ],
  commonPitfalls: [
    {
      name: "Shared Mutable Test Data",
      description: "Using shared, mutable test data across multiple tests, leading to test interdependence and flaky results when tests modify the shared data.",
      solution: "Create fresh test data for each test or use deep cloning to ensure each test works with an isolated copy of data.",
      preventativeMeasures: [
        "Design data factories to create fresh entities for each test",
        "Implement proper cleanup between tests",
        "Use test frameworks' isolation features to prevent shared state"
      ]
    },
    {
      name: "Unrealistic Test Data",
      description: "Using oversimplified or unrealistic test data that doesn't represent production scenarios, leading to tests that miss real-world issues.",
      solution: "Create test data that reflects the complexity and constraints of production data, including edge cases and realistic relationships.",
      preventativeMeasures: [
        "Review test data against production examples",
        "Include validation in data factories to ensure realism",
        "Develop specific factories for edge cases and special scenarios"
      ]
    },
    {
      name: "Insufficient Data Cleanup",
      description: "Failing to properly clean up test data after tests, causing test pollution, database bloat, and potential test interference.",
      solution: "Implement thorough, reliable cleanup mechanisms that execute even when tests fail.",
      preventativeMeasures: [
        "Use try-finally blocks to ensure cleanup happens after errors",
        "Track all created entities for complete cleanup",
        "Implement periodic cleanup jobs in CI pipelines"
      ]
    },
    {
      name: "Performance Issues with Data Creation",
      description: "Creating excessive or inefficient test data, leading to slow tests and reduced developer productivity.",
      solution: "Optimize data creation by using batching, minimizing the data created, and implementing efficient setup strategies.",
      preventativeMeasures: [
        "Use bulk operations where possible",
        "Create only the minimal data needed for each test",
        "Profile data creation to identify bottlenecks"
      ]
    },
    {
      name: "Hardcoded Test Data IDs",
      description: "Hardcoding entity IDs in tests, creating potential conflicts between tests and making tests brittle to database changes.",
      solution: "Generate unique, random IDs for test entities or use a consistent naming strategy that ensures uniqueness.",
      preventativeMeasures: [
        "Use UUID or similar generators for entity IDs",
        "Implement ID prefixing or namespacing for test data",
        "Create ID generation utilities that ensure uniqueness"
      ]
    },
    {
      name: "Inadequate Error Handling in Data Setup",
      description: "Poor error handling in data setup code, making it difficult to diagnose test failures related to data preparation.",
      solution: "Implement comprehensive error handling with clear error messages and logging for data setup operations.",
      preventativeMeasures: [
        "Add detailed error reporting in data factories and managers",
        "Implement validation before database operations",
        "Create specific error types for different data setup issues"
      ]
    }
  ],
  improvementGuidelines: {
    description: "Strategies for improving test data management over time.",
    metrics: [
      {
        name: "Data Setup Time",
        description: "The time spent setting up test data relative to actual test execution. Efficient data management should minimize setup time.",
        assessmentMethod: "Measure and track the time spent in data creation versus test execution. Optimize data factories that consume a disproportionate amount of time."
      },
      {
        name: "Test Data Volume",
        description: "The amount of test data created for tests. Minimizing data volume improves performance while maintaining test effectiveness.",
        assessmentMethod: "Track the number of entities created per test and overall. Review tests to ensure they create only necessary data."
      },
      {
        name: "Data Factory Reuse",
        description: "How frequently data factories are reused across tests. Higher reuse indicates well-designed factories that provide value in multiple scenarios.",
        assessmentMethod: "Analyze which factories are used by which tests. Identify opportunities to consolidate or extend existing factories."
      },
      {
        name: "Cleanup Effectiveness",
        description: "How effectively test data is cleaned up after tests. Thorough cleanup prevents test pollution and database growth.",
        assessmentMethod: "Monitor test database size over time. Implement periodic audits to identify orphaned test data."
      }
    ]
  },
  resources: [
    {
      type: "documentation",
      name: "Factory Pattern for Test Data",
      description: "Guide to implementing the factory pattern for test data generation.",
      link: "https://refactoring.guru/design-patterns/factory-method"
    },
    {
      type: "tutorial",
      name: "Testing Database Applications",
      description: "Best practices for testing applications that interact with databases.",
      link: "https://martinfowler.com/articles/practical-test-pyramid.html#DatabaseIntegrationTests"
    },
    {
      type: "reference",
      name: "Playwright Test Fixtures",
      description: "Documentation for Playwright test fixtures, which can be used for test data management.",
      link: "https://playwright.dev/docs/test-fixtures"
    },
    {
      type: "tool",
      name: "faker.js",
      description: "A library for generating realistic fake data for tests.",
      link: "https://github.com/faker-js/faker"
    }
  ],
  conclusion: "Effective test data management is crucial for reliable, maintainable E2E tests. By implementing proper data isolation, realistic data models, deterministic generation, and thorough cleanup, teams can create tests that consistently validate application behavior without interference or flakiness. The investment in robust test data utilities pays dividends through faster test development, more reliable test execution, and clearer test failures. Remember that good test data management is an ongoing process that should evolve with the application, ensuring tests remain effective as the system grows and changes."
}; 