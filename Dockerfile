# ====================================
# Dockerfile — Static Website (Nginx)
# ====================================
FROM nginx:alpine

# Copy website files into Nginx's default serve directory
COPY index.html /usr/share/nginx/html/index.html
COPY style.css  /usr/share/nginx/html/style.css
COPY script.js  /usr/share/nginx/html/script.js

# Copy photo gallery folder if it exists
COPY photo_gallery/ /usr/share/nginx/html/photo_gallery/

# Optional: custom Nginx config (uncomment if you add nginx.conf)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
