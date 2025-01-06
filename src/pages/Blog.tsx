import { BlogList } from "@/components/blog/BlogList";
import { motion } from "framer-motion";

const Blog = () => {
  return (
    <div className="flex-1 w-full bg-gradient-to-br from-[#9b87f5]/5 to-[#FFDEE2]/5">
      <div className="w-full container mx-auto px-4 py-16 space-y-16">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
              Our Blog
            </h1>
            <p className="text-xl text-gray-600">
              Insights and guides for your debt-free journey
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <BlogList />
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Blog;