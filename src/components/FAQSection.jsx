import React, { useState, useEffect } from "react";
import "../css/bookings.css";

function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/faqs");
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  const toggleFAQ = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="faq-section">
      <div className="faq-header">
        <h3>Frequently Asked Questions</h3>
        <input
          type="text"
          className="faq-search"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="faq-list">
        {filteredFAQs.length === 0 ? (
          <p className="no-results">No FAQs found matching your search.</p>
        ) : (
          filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className={`faq-item ${expandedId === faq.id ? "expanded" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">
                  {expandedId === faq.id ? "−" : "+"}
                </span>
              </button>
              {expandedId === faq.id && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FAQSection;
