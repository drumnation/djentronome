/**
 * Skill-Jack: Database Test Containers
 * 
 * A comprehensive guide to using database test containers for reliable integration testing.
 * 
 * @module brain-garden/skill-jack
 * @category testing/tools
 */

/**
 * Skill-Jack on Database Test Containers
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * database test containers for isolation in integration tests.
 */
export const topicGuide = {
  topic: "Database Test Containers for Integration Testing",
  description: "A comprehensive approach to creating isolated, reproducible database environments for integration testing using container technology, enabling reliable tests that interact with real database systems.",
  corePrinciples: [
    {
      name: "Database Isolation",
      description: "Each test or test suite should run against its own isolated database instance to prevent interference between tests and ensure reproducible results.",
      examples: [
        "Spinning up a dedicated PostgreSQL container for each test suite",
        "Creating a unique MongoDB instance with its own data directory",
        "Using separate Redis containers with different port mappings for concurrent test runs"
      ]
    },
    {
      name: "Ephemeral Test Data",
      description: "Database content should be treated as ephemeral, created fresh for each test and disposed of afterward, ensuring test independence and avoiding state leakage.",
      examples: [
        "Creating necessary schema and tables before each test",
        "Populating test data through migrations or script-based setup",
        "Clearing or dropping the database after tests complete"
      ]
    },
    {
      name: "Realistic Database Behavior",
      description: "Tests should interact with actual database systems that exhibit the same behavior as production, including constraints, transactions, and performance characteristics.",
      examples: [
        "Testing with the same database version used in production",
        "Enforcing foreign key constraints in test databases",
        "Testing transaction isolation levels and concurrency patterns"
      ]
    },
    {
      name: "Container Resource Management",
      description: "Database containers should be efficiently managed to minimize resource usage, startup time, and cleanup overhead while ensuring test reliability.",
      examples: [
        "Reusing containers across test suites where appropriate",
        "Implementing proper container shutdown to release resources",
        "Setting memory and CPU limits to prevent container sprawl"
      ]
    },
    {
      name: "Configurable Database State",
      description: "Test infrastructure should support configuring the database to specific states required by different tests, making it easy to test various scenarios.",
      examples: [
        "Loading different sets of seed data based on test requirements",
        "Supporting point-in-time recovery for complex state setup",
        "Providing utilities to create specific data conditions"
      ]
    },
    {
      name: "Environment Parity",
      description: "Test database environments should closely mirror production configurations to catch environment-specific issues early, while remaining fast and lightweight for testing.",
      examples: [
        "Using the same database configuration parameters where practical",
        "Testing with similar schema constraints and indexes",
        "Simulating production-like conditions such as high load or limited connections"
      ]
    }
  ],
  applicationProcess: {
    description: "A systematic approach to implementing and using database test containers effectively in integration tests.",
    steps: [
      {
        name: "Set Up Container Infrastructure",
        description: "Establish the necessary infrastructure to create, manage, and connect to containerized databases for testing.",
        agentActions: [
          {
            action: "Install and configure container technology",
            explanation: "Set up Docker or a similar container platform as a prerequisite for running database containers."
          },
          {
            action: "Choose appropriate container images",
            explanation: "Select official or well-maintained database images that match your production environment versions."
          },
          {
            action: "Define container configuration",
            explanation: "Create container definitions with appropriate port mappings, volume mounts, and environment variables."
          }
        ]
      },
      {
        name: "Implement Test Database Management",
        description: "Develop utilities to create, initialize, and manage database containers during the test lifecycle.",
        agentActions: [
          {
            action: "Create container lifecycle functions",
            explanation: "Implement functions to start, stop, and clean up database containers programmatically."
          },
          {
            action: "Develop database initialization scripts",
            explanation: "Create scripts to set up schema, tables, and initial data required for tests."
          },
          {
            action: "Implement connection management",
            explanation: "Build utilities to obtain and manage database connections to the containerized instances."
          }
        ]
      },
      {
        name: "Integrate with Test Framework",
        description: "Connect the container management system with the testing framework to automate container lifecycle based on test execution.",
        agentActions: [
          {
            action: "Set up beforeAll/afterAll hooks",
            explanation: "Use test framework lifecycle hooks to start containers before tests and stop them afterward."
          },
          {
            action: "Implement per-test setup and cleanup",
            explanation: "Create utilities to prepare the database state for each test and clean up afterward."
          },
          {
            action: "Handle test parallelization",
            explanation: "Ensure database containers can be used with parallel test execution without conflicts."
          }
        ]
      },
      {
        name: "Create Test Data Management Utilities",
        description: "Develop utilities for creating, managing, and validating test data in containerized databases.",
        agentActions: [
          {
            action: "Implement test data factories",
            explanation: "Create functions that generate and insert test data with appropriate relationships."
          },
          {
            action: "Build data reset capabilities",
            explanation: "Implement mechanisms to reset the database to a known state between tests."
          },
          {
            action: "Develop data validation utilities",
            explanation: "Create functions to verify database state and assert expected outcomes."
          }
        ]
      },
      {
        name: "Optimize Container Performance",
        description: "Tune container usage to minimize overhead and maximize test execution speed.",
        agentActions: [
          {
            action: "Implement container reuse strategies",
            explanation: "Where appropriate, reuse containers across multiple tests rather than creating new ones."
          },
          {
            action: "Optimize database configuration",
            explanation: "Configure the database for testing speed rather than durability or production workloads."
          },
          {
            action: "Use efficient initialization techniques",
            explanation: "Employ database snapshots, dumps, or other fast initialization methods instead of rebuilding from scratch."
          }
        ]
      },
      {
        name: "Implement Error Handling and Debugging",
        description: "Add robust error handling and debugging capabilities to simplify troubleshooting test failures.",
        agentActions: [
          {
            action: "Create detailed logging",
            explanation: "Implement comprehensive logging of container and database operations for debugging."
          },
          {
            action: "Add container inspection utilities",
            explanation: "Create tools to inspect container state, logs, and database content during test failures."
          },
          {
            action: "Implement graceful failure handling",
            explanation: "Ensure that container failures don't leave resources hanging and provide clear error messages."
          }
        ]
      }
    ]
  },
  examples: {
    description: "Practical examples of database test containers in different testing scenarios.",
    useCases: [
      {
        scenario: "Testing a user authentication service",
        implementation: "Integration tests that verify user registration, login, and password reset flows against a containerized PostgreSQL database.",
        outcome: "Tests confirm that the authentication service correctly stores and retrieves user credentials, handles password hashing, and manages session tokens using a real PostgreSQL instance with the same constraints and behavior as production."
      },
      {
        scenario: "Testing a data import/export component",
        implementation: "Tests for a system that imports large datasets, processes them, and stores them in a MongoDB database using containerized MongoDB instances.",
        outcome: "Tests verify that the import component correctly handles various data formats, deals with validation errors, and properly structures data in the MongoDB collections, with each test using its own isolated MongoDB container."
      },
      {
        scenario: "Testing a caching layer with Redis",
        implementation: "Integration tests for a caching service that stores and retrieves data from Redis, using containerized Redis instances.",
        outcome: "Tests confirm that the caching service correctly implements TTL logic, handles cache misses and updates, and manages cache invalidation using real Redis instances with behavior identical to production."
      },
      {
        scenario: "Testing database migration scripts",
        implementation: "Tests that apply database migrations to a clean container database and verify the resulting schema and data transformations.",
        outcome: "Tests ensure that migrations correctly transform database schema and data, and can be applied successfully to databases in different starting states, using containerized databases that match the production environment."
      }
    ]
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Setting up a PostgreSQL test container",
      code: `
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { Pool } from 'pg';
import { UserRepository } from './user-repository';
import fs from 'fs';
import path from 'path';

describe('UserRepository Integration Tests', () => {
  let container: StartedTestContainer;
  let pool: Pool;
  let userRepository: UserRepository;
  
  beforeAll(async () => {
    // Start a PostgreSQL container
    container = await new GenericContainer('postgres:14')
      .withExposedPorts(5432)
      .withEnvironment({
        POSTGRES_USER: 'testuser',
        POSTGRES_PASSWORD: 'testpassword',
        POSTGRES_DB: 'testdb'
      })
      .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
      .start();
    
    // Create a connection pool
    pool = new Pool({
      host: container.getHost(),
      port: container.getMappedPort(5432),
      user: 'testuser',
      password: 'testpassword',
      database: 'testdb'
    });
    
    // Initialize the database schema
    const schemaScript = fs.readFileSync(
      path.join(__dirname, '../scripts/schema.sql'),
      'utf8'
    );
    await pool.query(schemaScript);
    
    // Create the repository with the test database
    userRepository = new UserRepository(pool);
  }, 60000); // Allow up to 60 seconds for container startup
  
  afterAll(async () => {
    // Close database connections
    await pool.end();
    
    // Stop the container
    await container.stop();
  });
  
  beforeEach(async () => {
    // Clear the users table before each test
    await pool.query('DELETE FROM users');
  });
  
  it('should create a new user', async () => {
    // Arrange
    const user = {
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    
    // Act
    const result = await userRepository.createUser(user);
    
    // Assert
    expect(result.id).toBeDefined();
    
    // Verify user was stored in the database
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [result.id]);
    expect(rows.length).toBe(1);
    expect(rows[0].username).toBe(user.username);
    expect(rows[0].email).toBe(user.email);
  });
  
  it('should find a user by username', async () => {
    // Arrange - insert a user directly
    const { rows } = await pool.query(
      'INSERT INTO users (username, email, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id',
      ['finduser', 'find@example.com', 'Find', 'User']
    );
    const userId = rows[0].id;
    
    // Act
    const foundUser = await userRepository.findByUsername('finduser');
    
    // Assert
    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBe(userId);
    expect(foundUser?.email).toBe('find@example.com');
  });
  
  it('should handle unique constraint violations', async () => {
    // Arrange - insert a user with a specific username
    await pool.query(
      'INSERT INTO users (username, email, first_name, last_name) VALUES ($1, $2, $3, $4)',
      ['existinguser', 'existing@example.com', 'Existing', 'User']
    );
    
    // Act & Assert - try to create another user with the same username
    const duplicateUser = {
      username: 'existinguser', // This username already exists
      email: 'another@example.com',
      firstName: 'Another',
      lastName: 'User'
    };
    
    await expect(userRepository.createUser(duplicateUser))
      .rejects.toThrow(/duplicate key value violates unique constraint/);
  });
});
`,
      explanation: "This example demonstrates how to set up a PostgreSQL container for integration testing using the TestContainers library. It shows the full lifecycle of the container, including creation, initialization with a schema script, test execution with database verification, and cleanup. The tests verify that the repository correctly interacts with the database, including handling constraint violations."
    },
    {
      language: "typescript",
      description: "MongoDB test container with data seeding",
      code: `
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { MongoClient, Db } from 'mongodb';
import { ProductService } from './product-service';

describe('ProductService Integration Tests', () => {
  let container: StartedTestContainer;
  let client: MongoClient;
  let db: Db;
  let productService: ProductService;
  
  // Sample test data
  const testProducts = [
    { name: 'Product 1', price: 9.99, category: 'electronics', stock: 100 },
    { name: 'Product 2', price: 19.99, category: 'electronics', stock: 50 },
    { name: 'Product 3', price: 5.99, category: 'books', stock: 200 }
  ];
  
  beforeAll(async () => {
    // Start a MongoDB container
    container = await new GenericContainer('mongo:5.0')
      .withExposedPorts(27017)
      .withEnvironment({
        MONGO_INITDB_ROOT_USERNAME: 'testuser',
        MONGO_INITDB_ROOT_PASSWORD: 'testpassword'
      })
      .start();
    
    // Connect to MongoDB
    const uri = \`mongodb://testuser:testpassword@\${container.getHost()}:\${container.getMappedPort(27017)}\`;
    client = new MongoClient(uri);
    await client.connect();
    
    // Create a test database
    db = client.db('test-db');
    
    // Create the service with the test database
    productService = new ProductService(db);
  }, 60000);
  
  afterAll(async () => {
    // Close the MongoDB connection
    await client.close();
    
    // Stop the container
    await container.stop();
  });
  
  beforeEach(async () => {
    // Clear and seed the products collection before each test
    const collection = db.collection('products');
    await collection.deleteMany({});
    await collection.insertMany(testProducts);
  });
  
  it('should find products by category', async () => {
    // Act
    const products = await productService.findByCategory('electronics');
    
    // Assert
    expect(products.length).toBe(2);
    expect(products[0].name).toBe('Product 1');
    expect(products[1].name).toBe('Product 2');
  });
  
  it('should update product stock', async () => {
    // Arrange
    const productCollection = db.collection('products');
    const product = await productCollection.findOne({ name: 'Product 1' });
    
    // Act
    const result = await productService.updateStock(product._id, -10);
    
    // Assert
    expect(result.success).toBe(true);
    
    // Verify the stock was updated in the database
    const updatedProduct = await productCollection.findOne({ _id: product._id });
    expect(updatedProduct.stock).toBe(90); // 100 - 10
  });
  
  it('should prevent stock from going negative', async () => {
    // Arrange
    const productCollection = db.collection('products');
    const product = await productCollection.findOne({ name: 'Product 2' });
    
    // Act
    const result = await productService.updateStock(product._id, -60);
    
    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toContain('insufficient stock');
    
    // Verify the stock wasn't changed
    const updatedProduct = await productCollection.findOne({ _id: product._id });
    expect(updatedProduct.stock).toBe(50); // Unchanged
  });
  
  it('should create a new product', async () => {
    // Arrange
    const newProduct = {
      name: 'New Product',
      price: 29.99,
      category: 'home',
      stock: 75
    };
    
    // Act
    const result = await productService.createProduct(newProduct);
    
    // Assert
    expect(result.id).toBeDefined();
    
    // Verify the product was added to the database
    const productCollection = db.collection('products');
    const product = await productCollection.findOne({ _id: result.id });
    expect(product).not.toBeNull();
    expect(product.name).toBe(newProduct.name);
    expect(product.price).toBe(newProduct.price);
  });
});
`,
      explanation: "This example shows how to use a MongoDB container for integration testing, including connecting to the database, seeding test data, and verifying service operations. It demonstrates how to test various database operations like querying, updating, and creating documents, all against a real MongoDB instance running in a container."
    },
    {
      language: "typescript",
      description: "Managing multiple database containers",
      code: `
import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { GenericContainer, StartedTestContainer, Network } from 'testcontainers';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { DataSyncService } from './data-sync-service';

describe('DataSyncService Integration Tests', () => {
  // Container references
  let postgresContainer: StartedTestContainer;
  let redisContainer: StartedTestContainer;
  
  // Database connections
  let pgPool: Pool;
  let redisClient: any;
  
  // Service under test
  let dataSyncService: DataSyncService;
  
  // Docker network for container communication
  let network: Network;
  
  beforeAll(async () => {
    // Create a shared network for containers
    network = await new Network().start();
    
    // Start PostgreSQL container
    postgresContainer = await new GenericContainer('postgres:14')
      .withNetwork(network)
      .withNetworkAliases('postgres-test')
      .withExposedPorts(5432)
      .withEnvironment({
        POSTGRES_USER: 'testuser',
        POSTGRES_PASSWORD: 'testpassword',
        POSTGRES_DB: 'testdb'
      })
      .start();
    
    // Start Redis container
    redisContainer = await new GenericContainer('redis:6')
      .withNetwork(network)
      .withNetworkAliases('redis-test')
      .withExposedPorts(6379)
      .start();
    
    // Connect to PostgreSQL
    pgPool = new Pool({
      host: postgresContainer.getHost(),
      port: postgresContainer.getMappedPort(5432),
      user: 'testuser',
      password: 'testpassword',
      database: 'testdb'
    });
    
    // Initialize PostgreSQL schema
    await pgPool.query(
      'CREATE TABLE IF NOT EXISTS items (id SERIAL PRIMARY KEY, name TEXT, value JSONB)'
    );
    
    // Connect to Redis
    redisClient = createClient({
      url: \`redis://\${redisContainer.getHost()}:\${redisContainer.getMappedPort(6379)}\`
    });
    await redisClient.connect();
    
    // Create the service with both database connections
    dataSyncService = new DataSyncService({
      postgres: pgPool,
      redis: redisClient
    });
  }, 90000); // Allow up to 90 seconds for container startup
  
  afterAll(async () => {
    // Close database connections
    await pgPool.end();
    await redisClient.quit();
    
    // Stop containers
    await postgresContainer.stop();
    await redisContainer.stop();
    
    // Stop the network
    await network.stop();
  });
  
  it('should sync data from PostgreSQL to Redis', async () => {
    // Arrange - add some data to PostgreSQL
    const testItems = [
      { name: 'item1', value: { prop: 'value1' } },
      { name: 'item2', value: { prop: 'value2' } }
    ];
    
    for (const item of testItems) {
      await pgPool.query(
        'INSERT INTO items (name, value) VALUES ($1, $2)',
        [item.name, JSON.stringify(item.value)]
      );
    }
    
    // Act
    const result = await dataSyncService.syncItemsToCache();
    
    // Assert
    expect(result.synced).toBe(2);
    
    // Verify data was synchronized to Redis
    const item1 = await redisClient.get('item:item1');
    const item2 = await redisClient.get('item:item2');
    
    expect(JSON.parse(item1)).toEqual({ prop: 'value1' });
    expect(JSON.parse(item2)).toEqual({ prop: 'value2' });
  });
  
  it('should retrieve data from cache with fallback to database', async () => {
    // Arrange - item exists in Redis cache
    await redisClient.set('item:cached', JSON.stringify({ prop: 'cachedValue' }));
    
    // Arrange - item exists only in database
    await pgPool.query(
      'INSERT INTO items (name, value) VALUES ($1, $2)',
      ['uncached', JSON.stringify({ prop: 'dbValue' })]
    );
    
    // Act & Assert - cached item should come from Redis
    const cachedItem = await dataSyncService.getItem('cached');
    expect(cachedItem).toEqual({ prop: 'cachedValue' });
    
    // Act & Assert - uncached item should be retrieved from db and cached
    const uncachedItem = await dataSyncService.getItem('uncached');
    expect(uncachedItem).toEqual({ prop: 'dbValue' });
    
    // Verify the previously uncached item is now in Redis
    const nowCachedItem = await redisClient.get('item:uncached');
    expect(JSON.parse(nowCachedItem)).toEqual({ prop: 'dbValue' });
  });
});
`,
      explanation: "This example demonstrates how to manage multiple database containers for testing a service that interacts with both PostgreSQL and Redis. It sets up a shared Docker network so the containers can communicate, initializes both databases, and tests a data synchronization service that moves data between them. This approach allows testing of complex multi-database interactions in an isolated environment."
    }
  ],
  commonPitfalls: [
    {
      name: "Resource Management Issues",
      description: "Not properly managing container resources leading to memory leaks, port conflicts, or excessive resource consumption during test runs.",
      solution: "Implement proper container cleanup in afterAll hooks and use resource limits to control container resource usage.",
      preventativeMeasures: [
        "Set explicit memory and CPU limits on containers",
        "Ensure container stop is called in afterAll hooks with proper error handling",
        "Use dynamic port allocation to avoid port conflicts"
      ]
    },
    {
      name: "Slow Test Execution",
      description: "Long container startup times causing integration tests to run too slowly, reducing developer feedback and CI/CD efficiency.",
      solution: "Optimize container startup through minimizing image size, reusing containers when possible, and parallelizing tests.",
      preventativeMeasures: [
        "Use lightweight database images specifically designed for testing",
        "Implement container reuse across test suites where appropriate",
        "Set up parallel test execution with isolated container instances"
      ]
    },
    {
      name: "Environment Inconsistencies",
      description: "Differences between containerized test databases and production databases leading to tests that pass but fail to catch real issues.",
      solution: "Ensure container configurations match production settings where relevant while still optimizing for test performance.",
      preventativeMeasures: [
        "Use the same database version and critical configuration parameters as production",
        "Enable the same constraints and validation rules as production",
        "Document any intentional differences between test and production environments"
      ]
    },
    {
      name: "Insufficient Container Health Checks",
      description: "Starting tests before the database container is fully initialized, leading to connection failures or inconsistent test behavior.",
      solution: "Implement robust container health checks and wait strategies to ensure databases are ready before tests begin.",
      preventativeMeasures: [
        "Use TestContainers wait strategies to verify database readiness",
        "Implement connection retry logic with appropriate timeouts",
        "Add explicit database health check queries before beginning tests"
      ]
    },
    {
      name: "Container Image Versioning Issues",
      description: "Using 'latest' tags or inconsistent versions for database containers, causing unexpected behavior when images are updated.",
      solution: "Pin container images to specific versions to ensure test consistency across environments and over time.",
      preventativeMeasures: [
        "Always specify explicit version tags for container images",
        "Document the database versions used in tests",
        "Implement a process for controlled updates of container versions"
      ]
    },
    {
      name: "Ineffective Data Cleanup",
      description: "Incomplete data cleanup between tests leading to test interference and hard-to-diagnose failures.",
      solution: "Implement comprehensive data cleanup strategies that reset the database to a known state between tests.",
      preventativeMeasures: [
        "Use transactions to isolate test data and roll back changes",
        "Implement thorough cleanup in beforeEach/afterEach hooks",
        "Consider recreating schema objects between tests for complete isolation"
      ]
    }
  ],
  improvementGuidelines: {
    description: "Strategies for improving the effectiveness and efficiency of database test containers over time.",
    metrics: [
      {
        name: "Container Startup Speed",
        description: "The time it takes to start and initialize database containers. Faster startup times lead to quicker test feedback loops.",
        assessmentMethod: "Measure container startup time separately from test execution. Optimize images, initialization scripts, and resource allocation to minimize startup time."
      },
      {
        name: "Test Execution Efficiency",
        description: "How efficiently tests utilize database containers, including connection sharing, parallel execution, and cleanup operations.",
        assessmentMethod: "Track test execution time and resource usage. Identify bottlenecks in database operations and optimize test data strategies."
      },
      {
        name: "Container Resource Usage",
        description: "The amount of system resources consumed by database containers during testing, affecting the number of tests that can run concurrently.",
        assessmentMethod: "Monitor CPU, memory, and disk usage of containers. Set appropriate limits and optimize database configurations for testing."
      },
      {
        name: "Test Isolation Effectiveness",
        description: "How well database containers isolate tests from each other, preventing test interference and ensuring reliable results.",
        assessmentMethod: "Check for flaky tests or tests whose results depend on execution order. Improve isolation strategies for problematic tests."
      }
    ]
  },
  resources: [
    {
      type: "documentation",
      name: "TestContainers for Node.js",
      description: "Official documentation for the TestContainers library, which provides lightweight, throwaway instances of common databases.",
      link: "https://node.testcontainers.org/"
    },
    {
      type: "tutorial",
      name: "Integration Testing with Docker",
      description: "A comprehensive guide to using Docker containers for integration testing in Node.js applications.",
      link: "https://www.testim.io/blog/node-js-integration-testing-with-docker/"
    },
    {
      type: "reference",
      name: "Docker Compose for Testing",
      description: "A reference guide for using Docker Compose to create multi-container test environments.",
      link: "https://docs.docker.com/compose/compose-file/"
    },
    {
      type: "tool",
      name: "DatabaseCleaner Strategies",
      description: "Techniques for efficiently cleaning database state between tests.",
      link: "https://github.com/DatabaseCleaner/database_cleaner"
    }
  ],
  conclusion: "Database test containers provide a powerful approach to integration testing by enabling tests to interact with real database systems in isolated, reproducible environments. By using container technology to create fresh database instances for testing, developers can ensure that tests are reliable, consistent, and truly verify the behavior of components that interact with databases. While this approach requires some initial setup and careful resource management, the benefits in terms of test confidence and ability to catch real-world issues far outweigh the costs. As database interactions are often critical components of applications, thorough testing with real database behavior is essential for building robust software systems."
}; 