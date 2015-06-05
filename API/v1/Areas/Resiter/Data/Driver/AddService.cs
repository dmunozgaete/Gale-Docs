using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Net.Http;

namespace API.Areas.Resiter.Data.Driver
{
    /// <summary>
    /// Ingresa un Conductor a la unidad de negocio
    /// </summary>
    public class AddService : Karma.REST.Http.HttpCreateActionResult<Models.CoordenadaConductor>
    {
        Models.ServicioConductor _servicio;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="T">TModel</param>
        public AddService(Models.CoordenadaConductor T, Models.ServicioConductor servicio)
            : base(T)
        {
            _servicio = servicio;
        }


        /// <summary>
        /// Update User
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<System.Net.Http.HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            //------------------------------------------------------------------------------------------------------
            // GUARD EXCEPTIONS
            //Karma.Exception.RestException.Guard(() => String.IsNullOrEmpty(Model), "CONDUCTOR_REQUERIDO", API.Resources.Errors.ResourceManager);
            //------------------------------------------------------------------------------------------------------

            //------------------------------------------------------------------------------------------------------
            // DB Execution
            using (Karma.Db.DataService svc = new Karma.Db.DataService("PA_GPS_INS_ServicioConductor"))
            {
                string QR_codigo = null;
                string QR_numero = null;
                string QR_volumen = null;

                if (!String.IsNullOrEmpty(_servicio.qr))
                {
                    string[] valores = _servicio.qr.Split(';');
                    if (valores.Length == 1)
                    {
                        QR_codigo = valores[0];
                    }

                    if (valores.Length == 2)
                    {
                        QR_numero = valores[1];
                    }

                    if (valores.Length == 3)
                    {
                        QR_volumen = valores[2];
                    }
                }

                svc.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());
                svc.Parameters.Add("UNEG_Token", HttpContext.Current.User.BusinessUnit());
                svc.Parameters.Add("VEHI_Token", Model.vehiculo);
                svc.Parameters.Add("TISE_Token", _servicio.tipo);
                svc.Parameters.Add("CORC_Latitud", Model.latitud);
                svc.Parameters.Add("CORC_Longitud", Model.longitud);

                svc.Parameters.Add("Estado", _servicio.estado);
                svc.Parameters.Add("SERC_Motivo", _servicio.motivo);
                svc.Parameters.Add("SERC_CodigoActivo", QR_codigo);
                svc.Parameters.Add("SERC_NumeroVisible", QR_numero);
                svc.Parameters.Add("SERC_Volumen", QR_volumen);

                var repo = this.ExecuteQuery(svc);

                if (_servicio.foto != null)
                {
                    Models.InformacionServicio servicio = repo.GetModel<Models.InformacionServicio>().FirstOrDefault();

                    //------------------------------------------------------------------------------------
                    //ADD LABEL'S
                    byte[] imagen = Convert.FromBase64String(_servicio.foto);
                    System.IO.MemoryStream originalImageStream = new System.IO.MemoryStream(imagen);
                    System.Drawing.Image image = System.Drawing.Image.FromStream(originalImageStream);

                    using (System.Drawing.Graphics graphic = System.Drawing.Graphics.FromImage(image))
                    {
                        #region GRPAHICS FUNCTION'S
                        //Opacity Rectangle
                        using (System.Drawing.Brush brush = new System.Drawing.SolidBrush(System.Drawing.Color.FromArgb(160, 255, 255, 255)))
                        {
                            graphic.FillRectangle(brush, 0, image.Height - 170, image.Width, 200);
                        }
                        graphic.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAlias;

                        var font = System.Drawing.FontFamily.GenericSansSerif;
                        float fontSize = 9.5F;
                        var line = 18;
                        var y = 165;
                        var x_value = 100;
                        var x_title = 5;
                        var color = System.Drawing.Brushes.Black;
                        Action<String, int> PaintTitle = new Action<String, int>((title, yPosition) =>
                        {
                            graphic.DrawString(
                                title,
                                new System.Drawing.Font(font, fontSize, System.Drawing.FontStyle.Regular),
                               color,
                                new System.Drawing.PointF(x_title, image.Height - yPosition)
                            );
                        });

                        Action<String, int> PaintValue = new Action<String, int>((value, yPosition) =>
                        {
                            graphic.DrawString(
                                value,
                                new System.Drawing.Font(font, fontSize, System.Drawing.FontStyle.Regular),
                                color,
                                new System.Drawing.PointF(x_value, image.Height - yPosition)
                            );
                        });
                        #endregion

                        #region LABEL'S
                        // {{EMPRESA}} - {{SUCURSAL}}
                        PaintTitle("RESITER", y);
                        PaintValue(servicio.SUCU_Nombre, y);

                        // Servicio - {{NOMBRE SERVICIO}}
                        y = y - line;
                        PaintTitle("Servicio:", y);
                        PaintValue(servicio.TISE_Nombre, y);

                        // Servicio - {{NOMBRE SERVICIO}}
                        y = y - line;
                        PaintTitle("Estado:", y);
                        PaintValue(servicio.ESTA_Nombre, y);

                        // Patente - {{Patente}}
                        y = y - line;
                        PaintTitle("Patente:", y);
                        PaintValue(servicio.VEHI_Patente, y);

                        // Patente - {{Patente}}
                        y = y - line;
                        PaintTitle("Conductor:", y);
                        PaintValue(servicio.ENTI_Nombre, y);

                        // Poligono - {{Poligono}}
                        y = y - line;
                        PaintTitle("Polígono:", y);
                        PaintValue(servicio.POLI_Nombre, y);

                        // Latitud - {{Latitud}}
                        y = y - line;
                        PaintTitle("Coordenadas:", y);
                        PaintValue(String.Format("{0} {1}", servicio.SERC_CORD_Latitud, servicio.SERC_CORD_Longitud), y);

                        // Fecha - {{Fecha}}
                        y = y - line;
                        PaintTitle("Fecha:", y);
                        PaintValue(servicio.SERC_Fecha.ToLongDateString() + " " + servicio.SERC_Fecha.ToLongTimeString(), y);

                        // Motivo - {{Motivo}}
                        y = y - line;
                        PaintTitle("Motivo:", y);
                        PaintValue(_servicio.motivo, y);
                        #endregion
                    }

                    var processedImage = new System.IO.MemoryStream();
                    image.Save(processedImage, System.Drawing.Imaging.ImageFormat.Png);
                    processedImage.Position = 0; //RESET STREAM POSITION TO 0 --> .NET STREAMCONTENT BUG???
                    //------------------------------------------------------------------------------------

                    using (Karma.Db.DataService svc2 = new Karma.Db.DataService("PA_MAE_INS_ImagenServicio"))
                    {
                        svc2.Parameters.Add("SERC_Codigo", servicio.SERC_Codigo);
                        svc2.Parameters.Add("ARCH_Nombre", System.Guid.NewGuid().ToString());
                        svc2.Parameters.Add("ARCH_Tamano", imagen.Length);
                        svc2.Parameters.Add("ARCH_ContentType", "image/jpeg");
                        svc2.Parameters.Add("ARCH_Binario", processedImage);
                        svc2.Parameters.Add("ENTI_Token", HttpContext.Current.User.PrimarySid());

                        this.ExecuteAction(svc2);
                    }
                }


                HttpResponseMessage response = new HttpResponseMessage(System.Net.HttpStatusCode.Created); ;

                return Task.FromResult(response);

            }
            //------------------------------------------------------------------------------------------------------
        }
    }
}