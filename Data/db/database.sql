/* Conditionally drop tables */

DROP TABLE IF EXISTS public.user_stat;
DROP TABLE IF EXISTS public.message;
DROP TABLE IF EXISTS public.achievement_reference;
DROP TABLE IF EXISTS public.achievement;
DROP TABLE IF EXISTS public.family_relationship;
DROP TABLE IF EXISTS public.family;
DROP TABLE IF EXISTS public.user;
DROP TABLE IF EXISTS public.image;

CREATE TABLE public.image
( id SERIAL PRIMARY KEY
, expires INT NOT NULL
, date_added TIMESTAMP NOT NULL
);

CREATE TABLE public.user
( id SERIAL PRIMARY KEY
, first_name CHAR(50) NOT NULL
, last_name CHAR(50) NOT NULL
, username CHAR(50) NOT NULL UNIQUE
, password CHAR(60) NOT NULL
, date_created TIMESTAMP NOT NULL
, profile_picture int
, CONSTRAINT fk_profile_picture FOREIGN KEY(profile_picture) REFERENCES public.image (id)
);

CREATE TABLE public.family
( id SERIAL PRIMARY KEY
, owner_id INT NOT NULL
, date_created TIMESTAMP NOT NULL
, family_name CHAR(80) NOT NULL
, CONSTRAINT fk_owner_id FOREIGN KEY(owner_id) REFERENCES public.user (id)
);

CREATE TABLE public.family_relationship
( id SERIAL PRIMARY KEY
, user_id INT NOT NULL
, family_id INT NOT NULL
, CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.user (id)
, CONSTRAINT fk_family_id FOREIGN KEY (family_id) REFERENCES public.family (id)
);

CREATE TABLE public.message
( id SERIAL PRIMARY KEY
, family_id INT NOT NULL
, sent_by INT NOT NULL
, image_id INT NOT NULL
, body CHAR(512) NOT NULL
, time_sent TIMESTAMP NOT NULL
, CONSTRAINT fk_sent_by FOREIGN KEY (sent_by) REFERENCES public.user (id)
, CONSTRAINT fk_family_id FOREIGN KEY (family_id) REFERENCES public.family (id)
, CONSTRAINT fk_image_id FOREIGN KEY(image_id) REFERENCES public.image (id) 
);

CREATE TABLE public.achievement
( id SERIAL PRIMARY KEY
, achievement_name CHAR(80) NOT NULL
, achievement_desc CHAR(256) NOT NULL
);

CREATE TABLE public.achievement_reference
( id SERIAL PRIMARY KEY
, user_id INT NOT NULL
, achievement_id INT NOT NULL
, CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.user (id)
, CONSTRAINT fk_achievment_id FOREIGN KEY (achievement_id) REFERENCES public.achievement (id)
);

CREATE TABLE public.user_stat
( id SERIAL PRIMARY KEY
, user_id INT NOT NULL
, games_won INT NOT NULL
, games_lost INT NOT NULL
, perfect_games INT NOT NULL
, CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.user (id)
);





