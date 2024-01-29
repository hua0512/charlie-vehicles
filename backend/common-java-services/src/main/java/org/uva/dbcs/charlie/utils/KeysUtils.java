package org.uva.dbcs.charlie.utils;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import java.util.regex.Pattern;


public class KeysUtils {


  public static byte[] loadPEMFrom(String resource) throws IOException {
    URL url = KeysUtils.class.getResource(resource);
    InputStream in = url.openStream();
    String pem = new String(in.readAllBytes(), StandardCharsets.ISO_8859_1);
    return loadPEM(pem);
  }

  public static byte[] loadPEM(String certificate) {
    String pem = certificate;
    Pattern parse = Pattern.compile("(?m)(?s)^---*BEGIN.*---*$(.*)^---*END.*---*$.*");
    String encoded = parse.matcher(pem).replaceFirst("$1");
    return Base64.getMimeDecoder().decode(encoded);
  }

  public static PublicKey getRsaX509PublicKey(String certificate) throws NoSuchAlgorithmException, InvalidKeySpecException {
    byte[] keyBytes = loadPEM(certificate);
    KeyFactory kf = KeyFactory.getInstance("RSA");
    return kf.generatePublic(new java.security.spec.X509EncodedKeySpec(keyBytes));
  }

}
