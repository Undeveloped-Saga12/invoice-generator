from rest_framework import generics
from django.http import HttpResponse
from django.template.loader import get_template
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from .models import Invoice
from .serializers import InvoiceSerializer


# 1️⃣ List invoices + Create invoice
class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.all().order_by('-created_at')
    serializer_class = InvoiceSerializer


# 2️⃣ Retrieve single invoice (JSON)
class InvoiceDetailView(generics.RetrieveAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer


# 3️⃣ Download invoice as PDF
class InvoicePDFView(generics.RetrieveAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    def get(self, request, *args, **kwargs):
        invoice = self.get_object()

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = (
            f'attachment; filename="invoice_{invoice.invoice_number}.pdf"'
        )

        p = canvas.Canvas(response, pagesize=A4)
        width, height = A4

        y = height - 50

        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, y, invoice.business_name)

        p.setFont("Helvetica", 10)
        y -= 30
        p.drawString(50, y, f"Invoice #: {invoice.invoice_number}")
        y -= 20
        p.drawString(50, y, f"Date: {invoice.invoice_date}")
        y -= 20
        p.drawString(50, y, f"Due Date: {invoice.due_date}")

        y -= 40
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, y, "Bill To:")
        y -= 20
        p.setFont("Helvetica", 10)
        p.drawString(50, y, invoice.client_name)
        y -= 20
        p.drawString(50, y, invoice.client_email)

        y -= 40
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, y, "Amount Summary")

        y -= 20
        p.setFont("Helvetica", 10)
        p.drawString(50, y, f"Subtotal: ₹{invoice.subtotal}")
        y -= 20
        p.drawString(50, y, f"Tax: ₹{invoice.tax}")
        y -= 20
        p.drawString(50, y, f"Total: ₹{invoice.total}")

        p.showPage()
        p.save()

        return response