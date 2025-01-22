/* eslint-disable react-hooks/exhaustive-deps */
import Quiz from "@/components/quiz";
import { QuizType } from "@/models.module";
import { getCategories, getQuizzes } from "@/services/quizzesService";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    loadCategories();
    loadQuizzes();
  }, []);

  const loadCategories = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        category: selectedCategory || "",
        search: searchQuery || "",
        sortBy: sortOrder || "",
      };

      const response = await getQuizzes(params);
      setQuizzes(response);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  useEffect(() => {
    loadQuizzes();
  }, [searchQuery, selectedCategory, sortOrder]);

  return (
    <div>
      <h1>Quiz List</h1>

      <div className="filter-container">
        {/* Search Field */}
        <input
          type="text"
          placeholder="Search quizzes by title"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar input"
        />

        {/* Category Filter */}
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Sort Field */}
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="">Sort by</option>
          <option value="asc">Title: Ascending</option>
          <option value="desc">Title: Descending</option>
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Quiz List */}
      <div>
        {quizzes.map((quiz) => (
          <Quiz quiz={quiz} key={quiz.id} />
        ))}
      </div>
    </div>
  );
}
