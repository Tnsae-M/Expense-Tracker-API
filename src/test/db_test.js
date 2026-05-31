import { prisma } from "../config/lib";
async function runDiagnostics() {
    console.log("🚀 Starting Prisma 7 Diagnostic Test...");
    try {
        // 1. Test Database Connectivity
        console.log("📡 Attempting to connect to the database...");
        await prisma.$connect();
        console.log("✅ Successfully connected to the database!");
        // 2. Test a simple Raw Query to bypass schema-specific tables
        console.log("🔍 Running basic health check query...");
        const result = await prisma.$queryRaw `SELECT NOW();`;
        console.log("✅ Database health check passed. Current Time:", result);
        // 3. Optional: Test schema model access (Uncomment if your tables are migrated)
        console.log("👥 Fetching first 5 categories...");
        const categories = await prisma.category.findMany({ take: 5 });
        console.log("✅ Schema model verification passed. Found categories:", categories.length);
        // console.log("categories: ", categories);
    }
    catch (error) {
        console.error("❌ Diagnostic Failed!");
        console.error(error);
    }
    finally {
        // 4. Clean up connection
        await prisma.$disconnect();
        console.log("🛑 Disconnected from database client.");
    }
}
runDiagnostics();
