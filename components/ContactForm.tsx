"use client";

import { useState } from "react";

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      alert("দয়া করে প্রয়োজনীয় ক্ষেত্রগুলো (নাম এবং ইমেইল) পূরণ করুন।");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, message }),
      });

      if (res.ok) {
        alert(`ধন্যবাদ, ${firstName} ${lastName}! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।`);
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "বার্তা পাঠাতে সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। পুনরায় চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-panel">
      <h3 className="comment-form-title">Comment or Message</h3>
      <form onSubmit={handleSubmit}>
        <div className="comment-form-grid">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">First Name *</label>
            <input 
              type="text" 
              id="firstName" 
              className="form-input" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">Last Name *</label>
            <input 
              type="text" 
              id="lastName" 
              className="form-input" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required 
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email *</label>
          <input 
            type="email" 
            id="email" 
            className="form-input" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="message" className="form-label">Comment or Message</label>
          <textarea 
            id="message" 
            className="form-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "পাঠানো হচ্ছে..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
