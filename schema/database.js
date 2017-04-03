const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5433/voz_development';

const client = new pg.Client(connectionString);
client.connect();
const query_threads = client.query(
  'CREATE TABLE threads(id INTEGER PRIMARY KEY, title TEXT not null, source TEXT, pages INT not null, user_name VARCHAR(40)  , user_id INTEGER not null, last_updated TIMESTAMPTZ not null)');
query_threads.on('end', () => { client.end(); });

const query_posts = client.query(
  'CREATE TABLE posts(id INTEGER PRIMARY KEY, post_count INT not null, user_id INTEGER not null, user_name VARCHAR(40), content TEXT, time VARCHAR(40) not null, thread_id INTEGER REFERENCES threads not null)');
query_posts.on('end', () => { client.end(); });