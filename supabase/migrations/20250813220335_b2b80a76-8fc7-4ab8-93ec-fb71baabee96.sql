-- Fix security warning: Function Search Path Mutable
-- Update the handle_new_user function to have a proper search_path

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'display_name', new.email),
    new.raw_user_meta_data ->> 'phone'
  );
  RETURN new;
END;
$$;