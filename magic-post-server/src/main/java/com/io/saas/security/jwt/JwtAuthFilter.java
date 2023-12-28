package com.io.saas.security.jwt;


import com.auth0.jwt.exceptions.TokenExpiredException;
import com.io.saas.service.UserDetailService;
import com.io.saas.util.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailService userDetailService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "authorization, content-type, xsrf-token, FingerPrint");
        response.addHeader("Access-Control-Expose-Headers", "xsrf-token");

        if ("OPTIONS".equals(request.getMethod()) || request.getRequestURI().contains("healthcheck")) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            String jwtToken = jwtUtils.resolveToken(request);
            try {
                if (StringUtils.isNotEmpty(jwtToken)) {
                    try {
                        String userId = jwtUtils.extractUsername(jwtToken);
                        if (userId != null) {
                            UsernamePasswordAuthenticationToken authToken = userDetailService.loadUserByUserId(userId);
                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                            Authentication authentication = authToken;
                            if (authentication != null) {
                                SecurityContextHolder.getContext().setAuthentication(authentication);
                            }
                        }
                    } catch (TokenExpiredException e) {
                        response.sendError(HttpServletResponse.SC_NOT_ACCEPTABLE);
                    } catch (Exception e) {
                    }
                }
                filterChain.doFilter(request, response);
            } catch (Exception e) {
                e.printStackTrace();
                logger.error(e.getMessage());
            }
        }
    }
}
