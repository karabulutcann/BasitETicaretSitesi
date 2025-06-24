# Öğrenme Amaçlı E-Ticaret sitesi

Bu proje, öğrenme amaçlı geliştirilmiş bir e-ticaret sitesidir.

## Özellikler

- Kullanıcı kaydı ve girişi
- Ürün listeleme
- Ürün detay sayfası
- Sepete ekleme ve çıkarma
- Ödeme işlemi (İyzico ile)

## Kurulum

Projeyi çalıştırmak için aşağıdaki adımları izleyin:

```bash
# Repoyu klonlayın
git clone https://github.com/karabulutcann/BasicEcommerce.git basic-ecommerce
cd basic-ecommerce

# Bağımlılıkları yükleyin
npm install

# Ortam değişkenlerini ayarlayın
cp .env.example .env
# .env dosyasını kendi bilgilerinize göre doldurun

# Veritabanı migrasyonlarını uygulayın
npx drizzle-kit push

# Geliştirme sunucusunu başlatın
npm run dev
