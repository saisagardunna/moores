import { Phone, Mail, MapPin, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Moores</h3>
            <p className="text-primary-foreground/80 text-pretty">
              Premium ice cream crafted with love and the finest ingredients. Serving happiness one scoop at a time.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4" />
              <span>Made with love since years</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Information</h4>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span>6309312041</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>moores1807@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>Moores Ice Cream Store</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Business Hours</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <div className="flex justify-between">
                <span>Monday - Sunday</span>
                <span>10:00 AM - 10:00 PM</span>
              </div>
              <div className="text-sm">
                <p>Fresh ice cream available daily</p>
                <p>Home delivery available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2024 Moores Ice Cream. All rights reserved. | Made with ❤️ for ice cream lovers</p>
        </div>
      </div>
    </footer>
  )
}
