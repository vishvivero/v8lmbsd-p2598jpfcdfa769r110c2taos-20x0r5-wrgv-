import { motion } from "framer-motion";

const Blog = () => {
  const blogPosts = [
    {
      title: "Understanding the Debt Avalanche Method",
      date: "March 15, 2024",
      excerpt: "Learn how the debt avalanche method can help you save money on interest and become debt-free faster.",
      category: "Debt Strategies",
    },
    {
      title: "5 Tips for Creating a Successful Debt Repayment Plan",
      date: "March 10, 2024",
      excerpt: "Discover practical tips for creating and sticking to an effective debt repayment strategy.",
      category: "Financial Planning",
    },
    {
      title: "The Psychology of Debt: Breaking Free from Financial Stress",
      date: "March 5, 2024",
      excerpt: "Understanding the psychological aspects of debt and how to maintain mental well-being during debt repayment.",
      category: "Financial Wellness",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
        <p className="text-xl text-gray-600 mb-12">
          Insights and strategies to help you on your journey to financial freedom.
        </p>

        <div className="space-y-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <span className="text-sm text-primary font-medium">{post.category}</span>
              <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{post.date}</span>
                <button className="text-primary hover:text-primary/80 font-medium">
                  Read More →
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Blog;