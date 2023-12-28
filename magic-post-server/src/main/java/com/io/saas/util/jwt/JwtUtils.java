package com.io.saas.util.jwt;

import io.jsonwebtoken.Claims;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.io.saas.constant.JwtConstants;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    public String jwtSecret;

    public static String resolveToken(HttpServletRequest req) {
        String bearerToken = req.getHeader(JwtConstants.TOKEN_HEADER);
        if (bearerToken != null && bearerToken != "" && bearerToken.startsWith(JwtConstants.TOKEN_PREFIX)) {
            return bearerToken.replace(JwtConstants.TOKEN_PREFIX, "");
        }
        return null;
    }

    public static String getUserId(String bearer) throws Exception {
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String token = bearer.replace(JwtConstants.TOKEN_PREFIX, "");
        String[] chunks = token.split("\\.");
        String payload = new String(decoder.decode(chunks[1]));
        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(payload);
        return jsonObject.get("sub").toString();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token, jwtSecret);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token, String jwtSecret) {
        try {
            // Giải mã token và trả về các claims
            Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
            return claims;
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid token");
        }
    }

    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
//        claims.put("authorities", getAuthorities(userDetails.getAuthorities()));
        return createToken(claims, userDetails.getUsername(), JwtConstants.ACCESS_TOKEN_EXPIRED_TIME);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
//        claims.put("authorities", getAuthorities(userDetails.getAuthorities()));
        return createToken(claims, userDetails.getUsername(), JwtConstants.REFRESH_TOKEN_EXPIRED_TIME);
    }


    private String createToken(Map<String, Object> claims, String subject, long expiredTime) {
        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiredTime))
                .signWith(SignatureAlgorithm.HS256, jwtSecret).compact();
    }

}

