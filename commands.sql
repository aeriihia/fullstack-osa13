CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('Dan Abramov', 'www.abmarov.com', 'Writing Resilient Components');
insert into blogs (author, url, title) values ('Martin Fowler', 'www.fowler.com', 'Is High Quality Software Worth the Cost?');
insert into blogs (author, url, title) values ('Robert C. Martin', 'www.martin.com', 'FP vs. OO List Processing');