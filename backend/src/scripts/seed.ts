import { AppDataSource, initializeDatabase } from '../config/database';
import { User } from '../entities/User';
import { Category } from '../entities/Category';
import { Transaction } from '../entities/Transaction';

const seedData = {
  users: [
    {
      name: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      password: 'password123'
    },
    {
      name: 'María García',
      email: 'maria@ejemplo.com',
      password: 'password123'
    },
    {
      name: 'Carlos López',
      email: 'carlos@ejemplo.com', 
      password: 'password123'
    }
  ],

  categories: {
    income: [
      { name: 'Salario', description: 'Ingresos por trabajo', color: '#10b981' },
      { name: 'Freelance', description: 'Trabajos independientes', color: '#3b82f6' },
      { name: 'Inversiones', description: 'Retornos de inversiones', color: '#8b5cf6' },
      { name: 'Bonus', description: 'Bonificaciones y premios', color: '#f59e0b' },
      { name: 'Ventas', description: 'Ingresos por ventas', color: '#06b6d4' }
    ],
    expense: [
      { name: 'Alimentación', description: 'Comida y bebidas', color: '#ef4444' },
      { name: 'Transporte', description: 'Combustible, transporte público', color: '#f97316' },
      { name: 'Vivienda', description: 'Alquiler, servicios, mantenimiento', color: '#84cc16' },
      { name: 'Entretenimiento', description: 'Cine, restaurantes, ocio', color: '#ec4899' },
      { name: 'Salud', description: 'Médicos, medicinas, seguros', color: '#14b8a6' },
      { name: 'Educación', description: 'Cursos, libros, capacitación', color: '#6366f1' },
      { name: 'Compras', description: 'Ropa, tecnología, varios', color: '#a855f7' },
      { name: 'Servicios', description: 'Internet, telefonía, streaming', color: '#64748b' }
    ]
  },

  transactions: [
    // Ingresos para Juan Pérez (userId: 1) - Datos de 2025
    { description: 'Salario Agosto', amount: 2500.00, type: 'income', date: '2025-08-01', categoryName: 'Salario' },
    { description: 'Freelance diseño web', amount: 800.00, type: 'income', date: '2025-08-15', categoryName: 'Freelance' },
    { description: 'Salario Septiembre', amount: 2500.00, type: 'income', date: '2025-09-01', categoryName: 'Salario' },
    { description: 'Bonus por proyecto', amount: 500.00, type: 'income', date: '2025-09-03', categoryName: 'Bonus' },
    
    // Gastos para Juan Pérez - Septiembre 2025
    { description: 'Supermercado', amount: 150.50, type: 'expense', date: '2025-09-02', categoryName: 'Alimentación' },
    { description: 'Gasolina', amount: 60.00, type: 'expense', date: '2025-09-01', categoryName: 'Transporte' },
    { description: 'Alquiler', amount: 800.00, type: 'expense', date: '2025-09-01', categoryName: 'Vivienda' },
    { description: 'Cena restaurante', amount: 85.00, type: 'expense', date: '2025-09-04', categoryName: 'Entretenimiento' },
    { description: 'Internet', amount: 45.00, type: 'expense', date: '2025-09-01', categoryName: 'Servicios' },
    { description: 'Supermercado', amount: 180.75, type: 'expense', date: '2025-08-16', categoryName: 'Alimentación' },
    { description: 'Combustible', amount: 65.00, type: 'expense', date: '2025-08-20', categoryName: 'Transporte' },
    { description: 'Consulta médica', amount: 120.00, type: 'expense', date: '2025-08-25', categoryName: 'Salud' },
    { description: 'Compra ropa', amount: 200.00, type: 'expense', date: '2025-09-02', categoryName: 'Compras' },

    // Datos para María García (userId: 2) - 2025
    { description: 'Salario Agosto', amount: 3200.00, type: 'income', date: '2025-08-01', categoryName: 'Salario', userId: 2 },
    { description: 'Venta producto', amount: 150.00, type: 'income', date: '2025-08-10', categoryName: 'Ventas', userId: 2 },
    { description: 'Salario Septiembre', amount: 3200.00, type: 'income', date: '2025-09-01', categoryName: 'Salario', userId: 2 },
    { description: 'Freelance extra', amount: 450.00, type: 'income', date: '2025-09-03', categoryName: 'Freelance', userId: 2 },
    
    { description: 'Compras mensuales', amount: 220.00, type: 'expense', date: '2025-09-03', categoryName: 'Alimentación', userId: 2 },
    { description: 'Metro y bus', amount: 40.00, type: 'expense', date: '2025-09-02', categoryName: 'Transporte', userId: 2 },
    { description: 'Alquiler', amount: 1000.00, type: 'expense', date: '2025-09-01', categoryName: 'Vivienda', userId: 2 },
    { description: 'Curso online', amount: 99.00, type: 'expense', date: '2025-08-12', categoryName: 'Educación', userId: 2 },
    { description: 'Cine y cena', amount: 75.00, type: 'expense', date: '2025-08-18', categoryName: 'Entretenimiento', userId: 2 },

    // Datos para Carlos López (userId: 3) - 2025
    { description: 'Freelance desarrollo', amount: 1200.00, type: 'income', date: '2025-08-05', categoryName: 'Freelance', userId: 3 },
    { description: 'Dividendos', amount: 300.00, type: 'income', date: '2025-08-15', categoryName: 'Inversiones', userId: 3 },
    { description: 'Proyecto consultoría', amount: 2000.00, type: 'income', date: '2025-09-01', categoryName: 'Freelance', userId: 3 },
    { description: 'Venta acciones', amount: 750.00, type: 'income', date: '2025-09-02', categoryName: 'Inversiones', userId: 3 },
    
    { description: 'Supermercado', amount: 120.00, type: 'expense', date: '2025-09-01', categoryName: 'Alimentación', userId: 3 },
    { description: 'Uber', amount: 25.00, type: 'expense', date: '2025-09-03', categoryName: 'Transporte', userId: 3 },
    { description: 'Servicios básicos', amount: 150.00, type: 'expense', date: '2025-09-01', categoryName: 'Vivienda', userId: 3 },
    { description: 'Netflix y Spotify', amount: 28.00, type: 'expense', date: '2025-09-01', categoryName: 'Servicios', userId: 3 },
    { description: 'Gimnasio', amount: 45.00, type: 'expense', date: '2025-08-01', categoryName: 'Salud', userId: 3 }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await initializeDatabase();
    
    const userRepository = AppDataSource.getRepository(User);
    const categoryRepository = AppDataSource.getRepository(Category);
    const transactionRepository = AppDataSource.getRepository(Transaction);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await transactionRepository.clear();
    await categoryRepository.clear();
    await userRepository.clear();

    // Create users
    console.log('👥 Creating users...');
    const createdUsers: User[] = [];
    for (const userData of seedData.users) {
      const user = userRepository.create(userData);
      const savedUser = await userRepository.save(user);
      createdUsers.push(savedUser);
      console.log(`✅ Created user: ${savedUser.name} (${savedUser.email})`);
    }

    // Create categories for each user
    console.log('🏷️ Creating categories...');
    const createdCategories: { [key: string]: Category } = {};
    
    for (const user of createdUsers) {
      // Income categories
      for (const catData of seedData.categories.income) {
        const category = categoryRepository.create({
          ...catData,
          userId: user.id
        });
        const savedCategory = await categoryRepository.save(category);
        createdCategories[`${user.id}-${catData.name}`] = savedCategory;
      }
      
      // Expense categories
      for (const catData of seedData.categories.expense) {
        const category = categoryRepository.create({
          ...catData,
          userId: user.id
        });
        const savedCategory = await categoryRepository.save(category);
        createdCategories[`${user.id}-${catData.name}`] = savedCategory;
      }
      
      console.log(`✅ Created categories for user: ${user.name}`);
    }

    // Create transactions
    console.log('💰 Creating transactions...');
    let transactionCount = 0;
    
    for (const transData of seedData.transactions) {
      // Map to correct user IDs based on array index
      const userIndex = (transData.userId || 1) - 1; // Convert 1,2,3 to 0,1,2
      const actualUserId = createdUsers[userIndex]?.id || createdUsers[0].id;
      
      const categoryKey = `${actualUserId}-${transData.categoryName}`;
      const category = createdCategories[categoryKey];
      
      if (!category) {
        console.warn(`⚠️ Category not found: ${transData.categoryName} for user ${actualUserId}`);
        continue;
      }

      const transaction = transactionRepository.create({
        description: transData.description,
        amount: transData.amount,
        type: transData.type as 'income' | 'expense',
        date: new Date(transData.date),
        userId: actualUserId,
        categoryId: category.id
      });
      
      await transactionRepository.save(transaction);
      transactionCount++;
    }

    console.log(`✅ Created ${transactionCount} transactions`);

    // Show summary
    const userCount = await userRepository.count();
    const categoryCount = await categoryRepository.count();
    const totalTransactions = await transactionRepository.count();

    console.log('\n📊 Seeding Summary:');
    console.log(`👥 Users: ${userCount}`);
    console.log(`🏷️ Categories: ${categoryCount}`);
    console.log(`💰 Transactions: ${totalTransactions}`);
    
    // Show test accounts
    console.log('\n🔐 Test Accounts:');
    for (const user of seedData.users) {
      console.log(`📧 Email: ${user.email} | 🔑 Password: ${user.password}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };