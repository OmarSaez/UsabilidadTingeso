package edu.mtisw.prestabank_backend.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.mtisw.prestabank_backend.Entity.LoanEntity;
import edu.mtisw.prestabank_backend.Service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/loan")
@CrossOrigin("*")
public class LoanController {
    @Autowired
    LoanService loanService;

    private static final Logger logger = LoggerFactory.getLogger(LoanController.class); //MEnsaje por cosnla

    //URL rescatar todas los prestamos
    @GetMapping("/")
    public ResponseEntity<List<LoanEntity>> listLoan(){
        List<LoanEntity> loans = loanService.getLoans();
        return ResponseEntity.ok(loans);
    }

    //URL rescatar un loan por su ID
    @GetMapping("/{id}")
    public ResponseEntity<LoanEntity> getLoan(@PathVariable Long id){
        LoanEntity loan = loanService.getLoanById(id);
        return ResponseEntity.ok(loan);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<String> getLoanPdfBase64(@PathVariable Long id) {
        logger.info("--Se logro entrar a la URL /loan/{id}/pdf");
        LoanEntity loan = loanService.getLoanById(id);  // Obtén el préstamo
        byte[] pdfContent = loan.getPapers();        // Contenido binario del PDF

        if (pdfContent == null) {
            logger.error("--No se encontro le archivo PDF");
            return ResponseEntity.status(404).body("Archivo no encontrado");
        }

        // Codificar en Base64
        String base64Pdf = Base64.getEncoder().encodeToString(pdfContent);
        logger.info("--Se encontro el PDF y se codifico en 64");

        return ResponseEntity.ok(base64Pdf);
    }

    //URl rescatar todos los loan por el ID del USER
    @GetMapping("/user/{idUser}")
    public ResponseEntity<List<LoanEntity>> getLoansByUser(@PathVariable Long idUser){
        List<LoanEntity> loans = loanService.getLoansByIdUser(idUser);
        return ResponseEntity.ok(loans);
    }

    //URL guardar un prestamo
    @PostMapping("/")
    public ResponseEntity<LoanEntity> saveLoan(@RequestParam("loan") String loanJson,
                                               @RequestParam("file") MultipartFile file) {
        try {
            // Deserializa el JSON manualmente
            ObjectMapper objectMapper = new ObjectMapper();
            LoanEntity loan = objectMapper.readValue(loanJson, LoanEntity.class);

            logger.info("---");
            logger.info("Datos del préstamo: " + loan);
            logger.info("Archivo recibido: " + file.getOriginalFilename());

            LoanEntity savedLoan = loanService.saveLoan(loan, file);
            return ResponseEntity.ok(savedLoan);

        } catch (Exception e) {
            logger.error("¡¡Error al guardar el préstamo: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    //URL actualizar un prestamo
    @PutMapping("/")
    public ResponseEntity<LoanEntity> updateLoan(@RequestBody LoanEntity changeLoan) {
        LoanEntity updateLoan = loanService.updateLoan(changeLoan);
        return ResponseEntity.ok(updateLoan);
    }

    //URL borrar un prestamo por su ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteLoanById(@PathVariable Long id) throws Exception{
        var isDeleted = loanService.deleteLoan(id);
        return ResponseEntity.noContent().build();
    }

    //URL buscar todos los prestamos por rechazo o apruebo
    @GetMapping("/status/{status}")
    public ResponseEntity<List<LoanEntity>> listStatusLoans(@PathVariable int status){
        List<LoanEntity> loans = loanService.getLoanByStatus(status);
        return ResponseEntity.ok(loans);
    }


    //URL buscar todos los prestamos por tipo
    @GetMapping("/type/{type}")
    public ResponseEntity<List<LoanEntity>> listTypeLoans(@PathVariable int type){
        List<LoanEntity> loans = loanService.getLoanByType(type);
        return ResponseEntity.ok(loans);
    }

    //URL update para un Ejecutivo
    @PutMapping("/executive")
    public ResponseEntity<LoanEntity> updateLoanWithExecutive(@RequestBody LoanEntity changeLoan, @RequestParam int acountYears, @RequestParam List<Integer> balanceLast12) { // Usa List<Integer>

        // Convertir List<Integer> a ArrayList<Integer>
        ArrayList<Integer> balanceLast12ArrayList = new ArrayList<>(balanceLast12);

        // Llama al servicio con el ArrayList
        LoanEntity updateLoan = loanService.updateLoanWithExcutive(changeLoan, acountYears, balanceLast12ArrayList);

        return ResponseEntity.ok(updateLoan);
    }

    //URL para hace simulacion de cuota mensual
    @PostMapping("/simulate")
    public ResponseEntity<Double> simulateLoan(@RequestBody LoanSimulationRequest request) {
        double monthlyPayment = loanService.simulateLoan(
                request.getLoanAmount(),
                request.getYearInterestRate(),
                request.getYearPayments()
        );
        logger.info("---Valor devuelto al front: {}", monthlyPayment);
        return ResponseEntity.ok(monthlyPayment);
    }

}
