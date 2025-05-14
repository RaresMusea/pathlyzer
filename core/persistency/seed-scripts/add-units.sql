INSERT INTO "Unit" (id, course_id, exam_id, name, description, "order", created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    '0630b5b4-fa20-4130-9a94-ca01153433e7',
    NULL,
    'HTML Basics',
    'Introduction to the basic building blocks of an HTML document.',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    '0630b5b4-fa20-4130-9a94-ca01153433e7',
    NULL,
    'HTML Lists and Links',
    'Understanding how to structure content using lists and hyperlinks.',
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    '0630b5b4-fa20-4130-9a94-ca01153433e7',
    NULL,
    'Images and Media',
    'Embedding images and multimedia elements in web pages.',
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );
