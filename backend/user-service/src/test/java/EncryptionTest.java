import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;


public class EncryptionTest {

  @Test
  public void testEncrypt() {
    String message = "123456";
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(BCryptPasswordEncoder.BCryptVersion.$2B);
    String encryptedMessage = encoder.encode(message);
    System.out.println(encryptedMessage);
    assertTrue(encoder.matches(message, encryptedMessage));
  }
}
