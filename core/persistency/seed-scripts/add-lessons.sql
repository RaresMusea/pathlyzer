INSERT INTO "Lesson" (id, unit_id, title, description, content, "order", created_at, updated_at)
VALUES
  (gen_random_uuid(), 'd8080950-4ece-481c-b929-c41132d72d87', 'What is HTML?', 'Understanding the purpose and structure of HTML.', '{}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'd8080950-4ece-481c-b929-c41132d72d87', 'Basic Tags', 'Learn about <html>, <head>, <body> and how they define an HTML document.', '{}', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'd8080950-4ece-481c-b929-c41132d72d87', 'Nesting and Structure', 'Learn how to properly nest tags.', '{}', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Lesson" (id, unit_id, title, description, content, "order", created_at, updated_at)
VALUES
  (gen_random_uuid(), 'c3a1f2e3-e61f-4861-a98d-06d1b13874f8', 'Unordered vs Ordered Lists', 'Discover <ul> and <ol> tags.', '{}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'c3a1f2e3-e61f-4861-a98d-06d1b13874f8', 'Creating Links', 'Learn to use <a> tag and href attribute.', '{}', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'c3a1f2e3-e61f-4861-a98d-06d1b13874f8', 'Linking Internally and Externally', 'Understand relative vs absolute URLs.', '{}', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Lesson" (id, unit_id, title, description, content, "order", created_at, updated_at)
VALUES
  (gen_random_uuid(), '0639bd5a-d26c-4087-a6b0-672a060c94e4', 'Using the <img> Tag', 'Learn to embed images with src and alt.', '{}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), '0639bd5a-d26c-4087-a6b0-672a060c94e4', 'Image Formats and Optimization', 'Understand best practices for images on web.', '{}', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), '0639bd5a-d26c-4087-a6b0-672a060c94e4', 'Embedding Videos', 'Use <video> and <iframe> to embed media.', '{}', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), '0639bd5a-d26c-4087-a6b0-672a060c94e4', 'Accessibility with Media', 'Add alt text and captions for better accessibility.', '{}', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);