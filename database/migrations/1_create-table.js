const makeCourseTable = 
`CREATE TABLE IF NOT EXISTS public.courses2025
(
    major character varying(400) COLLATE pg_catalog."default" NOT NULL,
    majoryear character varying(20) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    prereq character varying(800) COLLATE pg_catalog."default",
    coreq character varying(800) COLLATE pg_catalog."default",
    unit character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT updatedcourses_pkey PRIMARY KEY (major, majoryear, title)
);`;

export default makeCourseTable; 