import React from "react";
import { Form, Button, Row, Col, Badge, Card } from "react-bootstrap";

const SearchFilter = ({
  searchKeyword,
  setSearchKeyword,
  selectedCategory,
  setSelectedCategory,
  onSearch,
  onReset,
  categories = [
    "IT",
    "Finance",
    "Marketing",
    "HR",
    "Sales",
    "Engineering",
    "Design",
    "Healthcare",
  ],
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="align-items-end">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search Jobs</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter job title, keyword, or company..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  size="lg"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                size="lg"
              >
                🔍 Search
              </Button>
            </Col>
            <Col md={3}>
              <Button
                variant="outline-secondary"
                onClick={onReset}
                className="w-100"
                size="lg"
              >
                🔄 Reset
              </Button>
            </Col>
          </Row>
        </Form>

        <div className="mt-4">
          <h6 className="mb-3">Filter by Category:</h6>
          <div className="d-flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                pill
                bg={selectedCategory === category ? "primary" : "light"}
                text={selectedCategory === category ? "white" : "dark"}
                className="px-3 py-2"
                style={{ cursor: "pointer", fontSize: "0.9rem" }}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
                {selectedCategory === category && (
                  <span className="ms-2">✕</span>
                )}
              </Badge>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SearchFilter;
