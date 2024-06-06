import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { getOrderItemDetail } from "../api/service"

pdfMake.vfs = pdfFonts.pdfMake.vfs

export const generateInvoice = async (order) => {
    const orderItems = await getOrderItemDetail(order.id)

    const docDefinition = {
        content: [
            { text: 'Hóa Đơn', style: 'header', alignment: 'center', margin: [0, 0, 0, 20] },

            { text: `Mã Hóa Đơn: #${order.id}`, style: 'subheader' },
            { text: `Ngày Đặt Hàng: ${order.order_date}`, style: 'subheader' },
            { text: `Khách hàng: ${order.customer}`, style: 'subheader' },
            { text: `Địa chỉ : ${order.shipping_address}`, style: 'subheader' },
            { text: `Số điện thoại: ${order.phone_number}`, style: 'subheader' },
            { text: '', margin: [0, 20, 0, 0] },

            {
                table: {
                    headerRows: 1,
                    widths: [30, '*', 80, 50, 80],
                    body: [
                        ['STT', 'Mô tả sản phẩm', 'Giá', 'Số lượng', 'Thành tiền'],
                        ...orderItems.map((item, index) => [index + 1, item.product, `$${item.price}`, item.quantity, `$${(item.price * item.quantity).toFixed(2)}`])
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 0 : 1; 
                    },
                    vLineWidth: function (i, node) {
                        return 0; 
                    },
                    paddingTop: function (i, node) {
                        return i === 0 ? 0 : 10; 
                    },
                    paddingBottom: function (i, node) {
                        return i === node.table.body.length - 1 ? 0 : 10; 
                    }
                }
            },
            { text: '', margin: [0, 20, 0, 0] },

            {
                columns: [
                    { text: 'Tổng giá trị sản phẩm:', width: '*', style: 'subheader' },
                    { text: `$${order.totalProductAmount}`, width: 'auto', style: 'subheader', alignment: 'right' }
                ]
            },
            {
                columns: [
                    { text: 'Phí vận chuyển:', width: '*', style: 'subheader' },
                    { text: `$${order.shippingFee}`, width: 'auto', style: 'subheader', alignment: 'right' }
                ]
            },
            {
                columns: [
                    { text: 'Giảm giá vận chuyển:', width: '*', style: 'subheader' },
                    { text: `$${order.discountShippingFee}`, width: 'auto', style: 'subheader', alignment: 'right' }
                ]
            },
            {
                columns: [
                    { text: 'Tổng giảm giá:', width: '*', style: 'subheader' },
                    { text: `$${order.discount_amount}`, width: 'auto', style: 'subheader', alignment: 'right' }
                ]
            },
            {
                columns: [
                    { text: 'Tổng cộng:', width: '*', style: 'subheader' },
                    { text: `$${order.total_amount}`, width: 'auto', style: 'subheader', alignment: 'right' }
                ]
            },

            { text: `Phương thức thanh toán: ${order.payment_method}`, style: 'subheader' },

            { text: "Liên hệ:", style: 'subheader' },
            { text: "Điện thoại: +84 123 647 840", style: 'subheader' },
            { text: "Email: abc@gmail.com", style: 'subheader' },
            { text: "Địa chỉ: 54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng", style: 'subheader' }
        ],
        styles: {
            header: {
                fontSize: 24,
                bold: true,
            },
            subheader: {
                fontSize: 12,
                margin: [0, 20, 0, 0] 
            }
        }
    };

    pdfMake.createPdf(docDefinition).download(`invoice_order_${order.id}.pdf`)
};
